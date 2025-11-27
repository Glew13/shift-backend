const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { getEnhancedMockData } = require('./mockData');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to parse natural language queries
function parseSearchQuery(query) {
    const params = {
        postcode: 'SW1A1AA',
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
            params.maxPrice = Math.max(...prices);
        } else if (query.toLowerCase().includes('around') || query.toLowerCase().includes('about')) {
            const price = prices[0];
            params.minPrice = Math.floor(price * 0.9);
            params.maxPrice = Math.ceil(price * 1.1);
        } else {
            params.maxPrice = Math.max(...prices);
        }
    }
    
    // Extract mileage
    const mileageMatch = query.match(/(\d+)[,]?(\d{3})?\s*(miles|mi)/gi);
    if (mileageMatch) {
        const mileages = mileageMatch.map(m => {
            return parseInt(m.replace(/[,a-z\s]/gi, ''));
        });
        
        if (query.toLowerCase().includes('under') || query.toLowerCase().includes('less than')) {
            params.maxMileage = Math.max(...mileages);
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
    
    return params;
}

// Build Cazoo URL
function buildCazooUrl(params) {
    let url = 'https://www.cazoo.co.uk/search?';
    
    if (params.make) {
        url += `make=${encodeURIComponent(params.make)}&`;
    }
    
    if (params.maxPrice) {
        url += `maxPrice=${params.maxPrice}&`;
    }
    
    if (params.minPrice) {
        url += `minPrice=${params.minPrice}&`;
    }
    
    if (params.maxMileage) {
        url += `maxMileage=${params.maxMileage}&`;
    }
    
    return url;
}

// Build Cinch URL
function buildCinchUrl(params) {
    let url = 'https://www.cinch.co.uk/used-cars?';
    
    if (params.make) {
        url += `make=${encodeURIComponent(params.make.toLowerCase())}&`;
    }
    
    if (params.maxPrice) {
        url += `maxPrice=${params.maxPrice}&`;
    }
    
    if (params.fuelType) {
        url += `fuelType=${encodeURIComponent(params.fuelType.toLowerCase())}&`;
    }
    
    return url;
}

// Scrape Cazoo
async function scrapeCazoo(params) {
    try {
        const url = buildCazooUrl(params);
        console.log('🔵 Trying Cazoo:', url);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-GB,en;q=0.9',
                'Referer': 'https://www.cazoo.co.uk/',
            },
            timeout: 8000
        });
        
        const $ = cheerio.load(response.data);
        const cars = [];
        
        // Try multiple Cazoo selectors
        const selectors = [
            '[data-testid="vehicle-card"]',
            '.vehicle-card',
            'article[data-vehicle-id]',
            '.search-result-card'
        ];
        
        for (const selector of selectors) {
            const elements = $(selector);
            if (elements.length > 0) {
                console.log(`✅ Found ${elements.length} cars on Cazoo with: ${selector}`);
                
                elements.each((index, element) => {
                    if (index >= 15) return false;
                    
                    const $el = $(element);
                    const title = $el.find('h2, h3, [data-testid="vehicle-title"]').text().trim();
                    const price = $el.find('[data-testid="vehicle-price"], .price').text().trim();
                    const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
                    const carUrl = $el.find('a').attr('href');
                    
                    const fullText = $el.text();
                    const yearMatch = fullText.match(/\b(20\d{2})\b/);
                    const mileageMatch = fullText.match(/([\d,]+)\s*miles?/i);
                    const fuelMatch = fullText.match(/\b(Petrol|Diesel|Electric|Hybrid)\b/i);
                    const transMatch = fullText.match(/\b(Manual|Automatic)\b/i);
                    
                    if (title && title.length > 5) {
                        cars.push({
                            title,
                            price: price || 'POA',
                            year: yearMatch ? yearMatch[1] : '',
                            mileage: mileageMatch ? mileageMatch[0] : 'N/A',
                            fuel: fuelMatch ? fuelMatch[1] : 'N/A',
                            transmission: transMatch ? transMatch[1] : 'N/A',
                            image: image && image.startsWith('//') ? 'https:' + image : image || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
                            url: carUrl && carUrl.startsWith('/') ? 'https://www.cazoo.co.uk' + carUrl : carUrl || '#',
                            source: 'Cazoo'
                        });
                    }
                });
                
                if (cars.length > 0) return cars;
            }
        }
        
        return null;
    } catch (error) {
        console.log('❌ Cazoo failed:', error.message);
        return null;
    }
}

// Scrape Cinch
async function scrapeCinch(params) {
    try {
        const url = buildCinchUrl(params);
        console.log('🟠 Trying Cinch:', url);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-GB,en;q=0.9',
                'Referer': 'https://www.cinch.co.uk/',
            },
            timeout: 8000
        });
        
        const $ = cheerio.load(response.data);
        const cars = [];
        
        const selectors = [
            '[data-testid="listing-card"]',
            '.listing-card',
            'article.vehicle',
            '.car-card'
        ];
        
        for (const selector of selectors) {
            const elements = $(selector);
            if (elements.length > 0) {
                console.log(`✅ Found ${elements.length} cars on Cinch with: ${selector}`);
                
                elements.each((index, element) => {
                    if (index >= 15) return false;
                    
                    const $el = $(element);
                    const title = $el.find('h2, h3, .title, [class*="title"]').text().trim();
                    const price = $el.find('.price, [class*="price"]').text().trim();
                    const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
                    const carUrl = $el.find('a').attr('href');
                    
                    const fullText = $el.text();
                    const yearMatch = fullText.match(/\b(20\d{2})\b/);
                    const mileageMatch = fullText.match(/([\d,]+)\s*miles?/i);
                    const fuelMatch = fullText.match(/\b(Petrol|Diesel|Electric|Hybrid)\b/i);
                    const transMatch = fullText.match(/\b(Manual|Automatic)\b/i);
                    
                    if (title && title.length > 5) {
                        cars.push({
                            title,
                            price: price || 'POA',
                            year: yearMatch ? yearMatch[1] : '',
                            mileage: mileageMatch ? mileageMatch[0] : 'N/A',
                            fuel: fuelMatch ? fuelMatch[1] : 'N/A',
                            transmission: transMatch ? transMatch[1] : 'N/A',
                            image: image && image.startsWith('//') ? 'https:' + image : image || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
                            url: carUrl && carUrl.startsWith('/') ? 'https://www.cinch.co.uk' + carUrl : carUrl || '#',
                            source: 'Cinch'
                        });
                    }
                });
                
                if (cars.length > 0) return cars;
            }
        }
        
        return null;
    } catch (error) {
        console.log('❌ Cinch failed:', error.message);
        return null;
    }
}

// Master scraping function with fallback chain
async function scrapeCarSupermarkets(params) {
    // Try Cazoo first
    let cars = await scrapeCazoo(params);
    if (cars && cars.length > 0) {
        console.log(`✅ SUCCESS: Got ${cars.length} cars from Cazoo`);
        return { cars, source: 'cazoo' };
    }
    
    // Try Cinch second
    cars = await scrapeCinch(params);
    if (cars && cars.length > 0) {
        console.log(`✅ SUCCESS: Got ${cars.length} cars from Cinch`);
        return { cars, source: 'cinch' };
    }
    
    // Fallback to smart demo data
    console.log('⚠️ All scrapers failed, using intelligent demo data');
    cars = getEnhancedMockData(JSON.stringify(params));
    return { cars, source: 'demo_data' };
}

// API endpoint for natural language search
app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        
        console.log('🔍 Searching for:', query);
        
        // Parse the natural language query
        const params = parseSearchQuery(query);
        console.log('📋 Parsed parameters:', params);
        
        // Try to scrape from car supermarkets
        const result = await scrapeCarSupermarkets(params);
        
        res.json({
            success: true,
            query,
            params,
            count: result.cars.length,
            cars: result.cars,
            source: result.source,
            message: result.source === 'demo_data' ? 'Using demo data - scrapers blocked' : `Live data from ${result.source}`
        });
        
    } catch (error) {
        console.error('❌ Search error:', error);
        
        // Return mock data on error
        const mockCars = getEnhancedMockData(req.body.query);
        
        res.json({
            success: true,
            query: req.body.query,
            count: mockCars.length,
            cars: mockCars,
            source: 'demo_data',
            message: 'Using demo data - error occurred'
        });
    }
});

// API endpoint for filter-based search
app.post('/api/filter-search', async (req, res) => {
    try {
        const filters = req.body;
        
        console.log('🔍 Filter search:', filters);
        
        // Try to scrape from car supermarkets
        const result = await scrapeCarSupermarkets(filters);
        
        res.json({
            success: true,
            filters,
            count: result.cars.length,
            cars: result.cars,
            source: result.source,
            message: result.source === 'demo_data' ? 'Using demo data - scrapers blocked' : `Live data from ${result.source}`
        });
        
    } catch (error) {
        console.error('❌ Filter search error:', error);
        
        // Return mock data on error
        const mockCars = getEnhancedMockData();
        
        res.json({
            success: true,
            filters: req.body,
            count: mockCars.length,
            cars: mockCars,
            source: 'demo_data',
            message: 'Using demo data - error occurred'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Shift API is running',
        scrapers: ['Cazoo', 'Cinch', 'Demo Data (100 cars)'],
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚗 Shift API server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🎯 Scraping: Cazoo → Cinch → Demo Data`);
    console.log(`📊 100-car intelligent fallback dataset ready`);
});
