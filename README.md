# Shift Backend API

Backend API for the Shift car search platform that scrapes AutoTrader UK to provide real-time car listings.

## Features

- 🔍 Natural language search parsing
- 🚗 Real-time AutoTrader UK scraping
- 📊 Traditional filter-based search
- 🎯 Smart parameter extraction from queries
- ⚡ Fast response times with caching

## Setup

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Installation

```bash
cd shift-backend
npm install
```

### Running Locally

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### POST /api/search

Natural language car search.

**Request:**
```json
{
  "query": "BMW 520d touring under £30k with low mileage"
}
```

**Response:**
```json
{
  "success": true,
  "query": "BMW 520d touring under £30k with low mileage",
  "params": {
    "make": "BMW",
    "model": "5 Series",
    "priceTo": 30000,
    "bodyType": "Estate",
    "fuelType": "Diesel"
  },
  "count": 15,
  "cars": [
    {
      "title": "BMW 520d M Sport Touring",
      "price": "£29,950",
      "year": "2021",
      "mileage": "18,500 miles",
      "fuel": "Diesel",
      "transmission": "Automatic",
      "image": "https://...",
      "url": "https://www.autotrader.co.uk/..."
    }
  ]
}
```

### POST /api/filter-search

Filter-based car search.

**Request:**
```json
{
  "make": "BMW",
  "priceTo": 30000,
  "maximumMileage": 50000,
  "fuelType": "Diesel",
  "transmission": "Automatic"
}
```

**Response:** Same format as /api/search

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Shift API is running"
}
```

## Natural Language Parsing

The API can understand complex natural language queries:

### Examples:

✅ "BMW 520d touring diesel under £30k with low mileage"
- Extracts: Make (BMW), Model (5 Series), Body Type (Estate), Fuel (Diesel), Max Price (£30,000)

✅ "7-seater SUV petrol or hybrid under 5 years old budget £25k"
- Extracts: Min Seats (7), Body Type (SUV), Fuel (Petrol/Hybrid), Price (£25,000), Year calculation

✅ "Manual rear-wheel drive sports car under £15k"
- Extracts: Transmission (Manual), Max Price (£15,000)

✅ "Electric car 250+ mile range under £35k with fast charging"
- Extracts: Fuel (Electric), Max Price (£35,000)

### Supported Patterns:

- **Price:** £30,000 | £30k | around £25k | under £20k | max £35,000
- **Mileage:** under 20,000 miles | less than 50k miles | low mileage
- **Make/Model:** BMW 520d | Audi A4 | Mercedes C-Class | Kia EV6
- **Fuel:** diesel | petrol | electric | EV | hybrid
- **Transmission:** manual | automatic | auto
- **Body Type:** estate | touring | SUV | hatchback | saloon | coupe
- **Year:** 2020 | under 5 years old | recent
- **Features:** 7-seater | heated seats | panoramic roof | Apple CarPlay

## Deployment Options

### 1. Railway.app (Recommended - Free Tier Available)

1. Create account at [railway.app](https://railway.app)
2. Install Railway CLI: `npm i -g @railway/cli`
3. Login: `railway login`
4. Deploy:
```bash
cd shift-backend
railway init
railway up
```
5. Get your URL: `railway domain`
6. Update frontend API_URL to your Railway domain

### 2. Render.com (Free Tier)

1. Create account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create new Web Service
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Deploy

### 3. Heroku

```bash
cd shift-backend
heroku create shift-api
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### 4. DigitalOcean App Platform

1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Create App from GitHub
3. Configure:
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: 3001

### 5. AWS Lambda + API Gateway (Serverless)

For production scale, convert to serverless:
1. Install Serverless Framework: `npm i -g serverless`
2. Create `serverless.yml`
3. Deploy: `serverless deploy`

## Environment Variables

Create a `.env` file for configuration:

```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourfrontend.com
RATE_LIMIT=100
CACHE_TTL=3600
```

## Frontend Integration

Update your frontend HTML:

```javascript
// In your HTML file
const API_URL = 'https://your-backend-url.railway.app/api';

// Or for local development
const API_URL = 'http://localhost:3001/api';
```

## Caching Strategy

To improve performance and reduce AutoTrader requests:

1. Add Redis for caching (recommended for production)
2. Cache search results for 1 hour
3. Use query hash as cache key

```bash
npm install redis
```

Add to server.js:
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache results
await client.setex(cacheKey, 3600, JSON.stringify(cars));

// Get cached results
const cached = await client.get(cacheKey);
```

## Rate Limiting

Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Legal Considerations

### Web Scraping Compliance:

1. **Respect robots.txt**: Check AutoTrader's robots.txt
2. **Rate limiting**: Don't overwhelm their servers (max 1 req/sec)
3. **User-Agent**: Identify your bot properly
4. **Terms of Service**: Review AutoTrader's ToS
5. **Alternative**: Consider AutoTrader's official API if available

### Better Approach:

For production, consider:
1. Partnering with AutoTrader for official API access
2. Using Google Custom Search API with AutoTrader domain filter
3. Building partnerships with dealerships directly
4. Using automotive data APIs (e.g., Cox Automotive, Dealer.com)

## Monitoring

Add logging and monitoring:

```bash
npm install winston morgan
```

```javascript
const winston = require('winston');
const morgan = require('morgan');

// HTTP request logging
app.use(morgan('combined'));

// Application logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Testing

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test search endpoint
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "BMW 520d under 30k"}'
```

## Production Checklist

- [ ] Add error handling and logging
- [ ] Implement rate limiting
- [ ] Add caching layer (Redis)
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Configure CORS for your domain
- [ ] Add request validation
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation (Swagger)
- [ ] Implement authentication if needed
- [ ] Set up database for saved searches
- [ ] Add unit and integration tests

## Next Steps

1. **Database Integration**: Add PostgreSQL for user accounts, saved searches, and shortlists
2. **Authentication**: Implement JWT auth for user sessions
3. **Email Notifications**: Alert users when matching cars are listed
4. **Dealer Integration**: Direct API integration with dealerships
5. **Advanced NLP**: Use GPT-4 for better query understanding
6. **Image Recognition**: Extract car features from photos
7. **Price Prediction**: ML model for fair price estimation

## Support

For issues or questions:
- Email: support@shift.com
- GitHub Issues: github.com/shift/api

## License

MIT License - see LICENSE file for details
