const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to parse natural language queries
function parseSearchQuery(query) {
    const params = {
        postcode: 'SW1A1AA', // Default London postcode - you can make this dynamic
        sort: 'relevance'
    };
    
    // Extract price
    const priceMatch = query.match(/£(\d+)[k,]?(\d{3})?/gi);
    if (priceMatch) {
        const prices = priceMatch.map(p => {
            let num = parseInt(p.replace(/[£,k]/gi, ''));
            if (p.toLowerCase().includes('k')) num *= 1000;
            return num;
        });
        
        if (query.toLowerCase().includes('under') || query.toLowerCase().includes('less than') || query.toLowerCase().includes('max')) {
            params.priceTo = Math.max(...prices);
        } else if (query.toLowerCase().includes('around') || query.toLowerCase().includes('about')) {
            const price = prices[0];
            params.priceFrom = Math.floor(price * 0.9);
            params.priceTo = Math.ceil(price * 1.1);
        } else {
            params.priceTo = Math.max(...prices);
        }
    }
    
    // Extract mileage
    const mileageMatch = query.match(/(\d+)[,]?(\d{3})?\s*(miles|mi)/gi);
    if (mileageMatch) {
        const mileages = mileageMatch.map(m => {
            return parseInt(m.replace(/[,a-z\s]/gi, ''));
        });
        
        if (query.toLowerCase().includes('under') || query.toLowerCase().includes('less than')) {
            params.maximumMileage = Math.max(...mileages);
        }
    }
    
    // Extract make/model
    const carMakes = {
        'bmw': 'BMW',
        'audi': 'Audi',
        'mercedes': 'Mercedes-Benz',
        'merc': 'Mercedes-Benz',
        'volkswagen': 'Volkswagen',
        'vw': 'Volkswagen',
        'volvo': 'Volvo',
        'kia': 'Kia',
        'hyundai': 'Hyundai',
        'toyota': 'Toyota',
        'honda': 'Honda',
        'ford': 'Ford',
        'vauxhall': 'Vauxhall',
        'nissan': 'Nissan',
        'mazda': 'Mazda',
        'mx-5': 'Mazda',
        'mx5': 'Mazda',
        'gt86': 'Toyota',
        '350z': 'Nissan',
        'land rover': 'Land Rover',
        'range rover': 'Land Rover',
        'porsche': 'Porsche',
        'jaguar': 'Jaguar',
        'tesla': 'Tesla'
    };
    
    const queryLower = query.toLowerCase();
    for (const [key, value] of Object.entries(carMakes)) {
        if (queryLower.includes(key)) {
            params.make = value;
            
            // Try to extract model
            if (key === 'bmw') {
                const modelMatch = query.match(/\b([1-8])\s*series\b/i) || query.match(/\b([1-8])(\d{2})\w*\b/i);
                if (modelMatch) {
                    params.model = modelMatch[1] + ' Series';
                }
            }
            break;
        }
    }
    
    // Extract fuel type
    if (queryLower.includes('diesel')) params.fuelType = 'Diesel';
    else if (queryLower.includes('petrol') && !queryLower.includes('hybrid')) params.fuelType = 'Petrol';
    else if (queryLower.includes('electric') || queryLower.includes(' ev ')) params.fuelType = 'Electric';
    else if (queryLower.includes('hybrid')) params.fuelType = 'Hybrid';
    
    // Extract transmission
    if (queryLower.includes('manual')) params.transmission = 'Manual';
    else if (queryLower.includes('automatic') || queryLower.includes('auto')) params.transmission = 'Automatic';
    
    // Extract body type
    if (queryLower.includes('estate') || queryLower.includes('touring')) params.bodyType = 'Estate';
    else if (queryLower.includes('suv')) params.bodyType = 'SUV';
    else if (queryLower.includes('hatchback')) params.bodyType = 'Hatchback';
    else if (queryLower.includes('saloon') || queryLower.includes('sedan')) params.bodyType = 'Saloon';
    else if (queryLower.includes('coupe')) params.bodyType = 'Coupe';
    else if (queryLower.includes('convertible')) params.bodyType = 'Convertible';
    
    // Extract year
    const yearMatch = query.match(/\b(20\d{2})\b/g);
    if (yearMatch) {
        const years = yearMatch.map(y => parseInt(y));
        params.yearFrom = Math.min(...years);
    }
    
    // Check for 7-seater requirement
    if (queryLower.includes('7-seat') || queryLower.includes('seven seat') || queryLower.includes('7 seat')) {
        params.minSeats = 7;
    }
    
    return params;
}

// Build AutoTrader URL from parameters
function buildAutoTraderUrl(params) {
    let url = 'https://www.autotrader.co.uk/car-search?';
    
    const paramMap = {
        make: 'make',
        model: 'model',
        priceFrom: 'price-from',
        priceTo: 'price-to',
        yearFrom: 'year-from',
        yearTo: 'year-to',
        maximumMileage: 'maximum-mileage',
        fuelType: 'fuel-type',
        transmission: 'transmission',
        bodyType: 'body-type',
        postcode: 'postcode',
        sort: 'sort',
        minSeats: 'min-seats'
    };
    
    for (const [key, value] of Object.entries(params)) {
        if (value && paramMap[key]) {
            url += `${paramMap[key]}=${encodeURIComponent(value)}&`;
        }
    }
    
    url += 'page=1';
    
    return url;
}

// Scrape AutoTrader search results
async function scrapeAutoTrader(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-GB,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        const cars = [];
        
        // AutoTrader uses article elements for each listing
        $('article[data-testid="trader-seller-listing"]').each((index, element) => {
            if (index >= 20) return false; // Limit to 20 results
            
            const $article = $(element);
            
            // Extract title
            const title = $article.find('h3').text().trim();
            
            // Extract price
            const price = $article.find('[data-testid="search-listing-price"]').text().trim();
            
            // Extract image
            const image = $article.find('img').first().attr('src') || 
                         $article.find('img').first().attr('data-src') ||
                         'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800';
            
            // Extract specs
            const specs = [];
            $article.find('ul li').each((i, li) => {
                specs.push($(li).text().trim());
            });
            
            // Parse specs
            let year = '', mileage = '', fuel = '', transmission = '';
            
            specs.forEach(spec => {
                if (spec.match(/\d{4}/)) year = spec.match(/\d{4}/)[0];
                if (spec.toLowerCase().includes('miles')) mileage = spec;
                if (spec.match(/petrol|diesel|electric|hybrid/i)) fuel = spec;
                if (spec.match(/manual|automatic/i)) transmission = spec;
            });
            
            // Extract URL
            const carUrl = 'https://www.autotrader.co.uk' + $article.find('a').first().attr('href');
            
            if (title && price) {
                cars.push({
                    title,
                    price,
                    year,
                    mileage: mileage || 'N/A',
                    fuel: fuel || 'N/A',
                    transmission: transmission || 'N/A',
                    image,
                    url: carUrl
                });
            }
        });
        
        return cars;
    } catch (error) {
        console.error('Error scraping AutoTrader:', error.message);
        throw error;
    }
}

// API endpoint for natural language search
app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        
        console.log('Searching for:', query);
        
        // Parse the natural language query
        const params = parseSearchQuery(query);
        console.log('Parsed parameters:', params);
        
        // Build AutoTrader URL
        const url = buildAutoTraderUrl(params);
        console.log('AutoTrader URL:', url);
        
        // Scrape results
        const cars = await scrapeAutoTrader(url);
        
        res.json({
            success: true,
            query,
            params,
            count: cars.length,
            cars
        });
        
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            error: 'Failed to search cars',
            message: error.message
        });
    }
});

// API endpoint for filter-based search
app.post('/api/filter-search', async (req, res) => {
    try {
        const filters = req.body;
        
        console.log('Filter search:', filters);
        
        // Build URL from filters
        const url = buildAutoTraderUrl(filters);
        console.log('AutoTrader URL:', url);
        
        // Scrape results
        const cars = await scrapeAutoTrader(url);
        
        res.json({
            success: true,
            filters,
            count: cars.length,
            cars
        });
        
    } catch (error) {
        console.error('Filter search error:', error);
        res.status(500).json({
            error: 'Failed to search cars',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Shift API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚗 Shift API server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});
