const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
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

// Build Motors.co.uk URL from parameters
function buildMotorsUrl(params) {
    let url = 'https://www.motors.co.uk/car-search/?';
    
    if (params.make) {
        url += `make=${encodeURIComponent(params.make)}&`;
    }
    
    if (params.maxPrice) {
        url += `price_to=${params.maxPrice}&`;
    }
    
    if (params.minPrice) {
        url += `price_from=${params.minPrice}&`;
    }
    
    if (params.maxMileage) {
        url += `maximum_mileage=${params.maxMileage}&`;
    }
    
    if (params.fuelType) {
        url += `fuel=${encodeURIComponent(params.fuelType)}&`;
    }
    
    if (params.transmission) {
        url += `transmission=${encodeURIComponent(params.transmission)}&`;
    }
    
    if (params.bodyType) {
        url += `body_type=${encodeURIComponent(params.bodyType)}&`;
    }
    
    return url;
}

// Scrape Motors.co.uk with Puppeteer (real browser)
async function scrapeMotorsWithPuppeteer(url) {
    let browser;
    try {
        console.log('🚀 Launching Puppeteer for:', url);
        
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080'
            ]
        });
        
        const page = await browser.newPage();
        
        // Set realistic viewport and user agent
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Navigate to the page with timeout
        console.log('📄 Loading page...');
        await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // Wait for car listings to load
        console.log('⏳ Waiting for content...');
        await page.waitForTimeout(3000); // Give it time to load
        
        // Extract car data from the page
        const cars = await page.evaluate(() => {
            const results = [];
            
            // Try multiple selectors
            const selectors = [
                'article.vehicle-card',
                '.listing-item',
                '[data-testid="vehicle-card"]',
                '.search-result-item',
                'div.vehicle-listing'
            ];
            
            let elements = [];
            for (const selector of selectors) {
                elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log(`Found ${elements.length} cars with: ${selector}`);
                    break;
                }
            }
            
            elements.forEach((el, index) => {
                if (index >= 15) return; // Limit to 15
                
                try {
                    // Extract title
                    const titleEl = el.querySelector('h2, h3, .vehicle-title, [class*="title"]');
                    const title = titleEl ? titleEl.textContent.trim() : '';
                    
                    // Extract price
                    const priceEl = el.querySelector('[class*="price"], .price');
                    const price = priceEl ? priceEl.textContent.trim() : 'POA';
                    
                    // Extract image
                    const imgEl = el.querySelector('img');
                    let image = imgEl ? (imgEl.src || imgEl.dataset.src) : '';
                    if (image && image.startsWith('//')) image = 'https:' + image;
                    
                    // Extract URL
                    const linkEl = el.querySelector('a');
                    let carUrl = linkEl ? linkEl.href : '';
                    
                    // Extract specs from text content
                    const fullText = el.textContent;
                    const yearMatch = fullText.match(/\b(20\d{2})\b/);
                    const mileageMatch = fullText.match(/([\d,]+)\s*miles?/i);
                    const fuelMatch = fullText.match(/\b(Petrol|Diesel|Electric|Hybrid)\b/i);
                    const transMatch = fullText.match(/\b(Manual|Automatic)\b/i);
                    
                    if (title && title.length > 3) {
                        results.push({
                            title: title,
                            price: price,
                            year: yearMatch ? yearMatch[1] : '',
                            mileage: mileageMatch ? mileageMatch[0] : 'N/A',
                            fuel: fuelMatch ? fuelMatch[1] : 'N/A',
                            transmission: transMatch ? transMatch[1] : 'N/A',
                            image: image || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
                            url: carUrl
                        });
                    }
                } catch (err) {
                    console.error('Error parsing car element:', err);
                }
            });
            
            return results;
        });
        
        await browser.close();
        
        if (cars.length > 0) {
            console.log(`✅ Successfully scraped ${cars.length} cars from Motors.co.uk`);
            return cars;
        } else {
            console.log('⚠️ No cars found with Puppeteer, using mock data');
            return getEnhancedMockData(url);
        }
        
    } catch (error) {
        console.error('❌ Puppeteer scraping error:', error.message);
        if (browser) await browser.close();
        return getEnhancedMockData(url);
    }
}

// Fallback: Scrape Motors.co.uk with Axios (fast but might be blocked)
async function scrapeMotors(url) {
    try {
        console.log('Trying quick scrape with Axios:', url);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-GB,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        const cars = [];
        
        // Motors.co.uk uses different selectors - trying multiple patterns
        const possibleSelectors = [
            '.listing-item',
            '.vehicle-card',
            'article[data-vehicle]',
            '.search-result',
            '[data-testid="vehicle-card"]'
        ];
        
        let foundCars = false;
        
        for (const selector of possibleSelectors) {
            const elements = $(selector);
            if (elements.length > 0) {
                console.log(`Found ${elements.length} cars with selector: ${selector}`);
                
                elements.each((index, element) => {
                    if (index >= 15) return false; // Limit to 15 results
                    
                    const $el = $(element);
                    
                    // Try to extract data with various patterns
                    const title = $el.find('h2, h3, .title, [class*="title"]').first().text().trim() ||
                                 $el.find('a[title]').attr('title') ||
                                 'Car listing';
                    
                    const price = $el.find('[class*="price"], .price, [data-price]').first().text().trim() ||
                                 $el.text().match(/£[\d,]+/)?.[0] ||
                                 'POA';
                    
                    const image = $el.find('img').first().attr('src') || 
                                 $el.find('img').first().attr('data-src') ||
                                 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800';
                    
                    const url = $el.find('a').first().attr('href') || '#';
                    
                    // Extract specs from text
                    const fullText = $el.text();
                    const yearMatch = fullText.match(/\b(20\d{2})\b/);
                    const mileageMatch = fullText.match(/([\d,]+)\s*miles?/i);
                    const fuelMatch = fullText.match(/\b(Petrol|Diesel|Electric|Hybrid)\b/i);
                    const transMatch = fullText.match(/\b(Manual|Automatic)\b/i);
                    
                    if (title && title.length > 3) {
                        cars.push({
                            title: title,
                            price: price,
                            year: yearMatch ? yearMatch[1] : '',
                            mileage: mileageMatch ? mileageMatch[0] : 'N/A',
                            fuel: fuelMatch ? fuelMatch[1] : 'N/A',
                            transmission: transMatch ? transMatch[1] : 'N/A',
                            image: image.startsWith('//') ? 'https:' + image : image,
                            url: url.startsWith('/') ? 'https://www.motors.co.uk' + url : url
                        });
                    }
                });
                
                if (cars.length > 0) {
                    foundCars = true;
                    break;
                }
            }
        }
        
        // If scraping failed, return enhanced mock data
        if (cars.length === 0) {
            console.log('Scraping failed, using enhanced mock data');
            return getEnhancedMockData(url);
        }
        
        return cars;
        
    } catch (error) {
        console.error('Error scraping Motors.co.uk:', error.message);
        // Return enhanced mock data on error
        return getEnhancedMockData();
    }
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
        
        // Build Motors.co.uk URL
        const url = buildMotorsUrl(params);
        console.log('🌐 Motors.co.uk URL:', url);
        
        // Try Puppeteer first (slower but more reliable)
        console.log('🤖 Attempting Puppeteer scraping...');
        let cars = await scrapeMotorsWithPuppeteer(url);
        
        // Check if we got real data
        const isRealData = cars.length > 0 && cars[0].url && cars[0].url.includes('motors.co.uk');
        
        res.json({
            success: true,
            query,
            params,
            count: cars.length,
            cars,
            source: isRealData ? 'motors.co.uk' : 'demo_data',
            scraping_method: isRealData ? 'puppeteer' : 'fallback'
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
            scraping_method: 'none',
            note: 'Using demo data - live scraping temporarily unavailable'
        });
    }
});

// API endpoint for filter-based search
app.post('/api/filter-search', async (req, res) => {
    try {
        const filters = req.body;
        
        console.log('🔍 Filter search:', filters);
        
        // Build URL from filters
        const url = buildMotorsUrl(filters);
        console.log('🌐 Motors.co.uk URL:', url);
        
        // Try Puppeteer first
        console.log('🤖 Attempting Puppeteer scraping...');
        let cars = await scrapeMotorsWithPuppeteer(url);
        
        const isRealData = cars.length > 0 && cars[0].url && cars[0].url.includes('motors.co.uk');
        
        res.json({
            success: true,
            filters,
            count: cars.length,
            cars,
            source: isRealData ? 'motors.co.uk' : 'demo_data',
            scraping_method: isRealData ? 'puppeteer' : 'fallback'
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
            scraping_method: 'none',
            note: 'Using demo data - live scraping temporarily unavailable'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Shift API is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚗 Shift API server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🤖 Using Puppeteer for Motors.co.uk scraping`);
    console.log(`📊 100-car demo dataset available as fallback`);
});
