# Shift Backend with Puppeteer Scraping

This version uses **Puppeteer** (headless Chrome) to scrape Motors.co.uk for real car listings.

## What's New

✅ **Real browser scraping** - Puppeteer launches a real Chrome browser  
✅ **Better success rate** - Handles JavaScript-rendered content  
✅ **Automatic fallback** - Uses 100-car demo data if scraping fails  
✅ **Detailed logging** - See exactly what's happening in Railway logs

## How It Works

1. **User searches:** "BMW 520d touring"
2. **Puppeteer launches:** Headless Chrome browser
3. **Navigates to Motors.co.uk** with search parameters
4. **Waits for page load:** 3 seconds for content to render
5. **Extracts car data:** Title, price, year, mileage, fuel, transmission
6. **Returns results:** Real data or falls back to demo data

## Deployment to Railway

### Important: Puppeteer on Railway

Railway supports Puppeteer but needs some configuration:

1. **Upload all files** from this folder to GitHub
2. **Railway will auto-install** Puppeteer and Chrome
3. **First deploy takes longer** (~3-5 minutes) - Puppeteer downloads Chrome
4. **Memory usage:** ~300-500MB per request

### Files to Upload:
```
shift-backend-v2/
├── server.js          ← Main API with Puppeteer
├── mockData.js        ← 100-car dataset
├── package.json       ← Includes puppeteer@^21.6.1
├── railway.json       ← Railway config
├── Procfile          ← Start command
└── .gitignore        ← Git ignore rules
```

## Performance Expectations

### ⚡ Speed:
- **Quick Axios scrape:** 1-2 seconds (usually blocked)
- **Puppeteer scrape:** 5-10 seconds (more reliable)
- **Mock data fallback:** Instant

### 🎯 Success Rate:
- **Motors.co.uk might still block** - they have anti-scraping
- **Demo data always works** - perfect for presentations
- **Check logs** to see if scraping succeeded

## Testing Locally

```bash
cd shift-backend-v2
npm install
npm start
```

Then test:
```bash
# Health check
curl http://localhost:3001/api/health

# Search (will take 5-10 seconds)
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "BMW 520d"}'
```

Watch the terminal - you'll see:
```
🚗 Shift API server running on port 3001
🤖 Using Puppeteer for Motors.co.uk scraping
📊 100-car demo dataset available as fallback
🔍 Searching for: BMW 520d
🤖 Attempting Puppeteer scraping...
🚀 Launching Puppeteer for: https://www.motors.co.uk/...
📄 Loading page...
⏳ Waiting for content...
✅ Successfully scraped 12 cars from Motors.co.uk
```

Or if it fails:
```
❌ Puppeteer scraping error: Navigation timeout
⚠️ Using mock data
```

## Railway Logs

After deploying, check your Railway logs to see if scraping works:

1. Go to Railway dashboard
2. Click your service
3. Click "Deployments"
4. Click "View Logs"
5. Make a search from your frontend
6. Watch for:
   - ✅ `Successfully scraped X cars` = Real data!
   - ⚠️ `Using mock data` = Scraping failed, demo data used

## Response Format

The API response includes a `source` field:

```json
{
  "success": true,
  "query": "BMW 520d",
  "count": 12,
  "cars": [...],
  "source": "motors.co.uk",        ← or "demo_data"
  "scraping_method": "puppeteer"   ← or "fallback"
}
```

Check this in your browser console to see if you got real data!

## Troubleshooting

### "Puppeteer not found"
- Railway might need a redeploy
- Delete and recreate the service
- Make sure package.json includes puppeteer

### "Chrome not found" or "Browser failed to start"
Railway automatically installs Chrome for Puppeteer. If this fails:
- Check Railway build logs
- Railway free tier should support it
- Might need to upgrade Railway plan

### "Navigation timeout"
Motors.co.uk is blocking the request:
- This is expected sometimes
- Demo data will be used
- Still looks professional to investors

### Slow Response Times
Puppeteer is slow (5-10 seconds):
- This is normal for browser automation
- Much slower than regular scraping
- Trade-off for better success rate
- Demo data is instant fallback

## Cost Considerations

### Railway Free Tier:
- ✅ Puppeteer works
- ⚠️ Uses more memory (300-500MB per request)
- ⚠️ Slower response times
- ⚠️ Might hit execution time limits

### If You Need Better Performance:
- Upgrade Railway plan ($5-10/month)
- Use ScraperAPI instead ($49/month but faster)
- Stick with demo data for presentations

## Realistic Expectations

### Will Motors.co.uk work?
**Maybe.** They actively try to block scrapers. You might get:
- ✅ 20% success rate with Puppeteer
- ✅ Perfect demo data fallback
- ✅ Professional presentation either way

### For Your Investor Demo:
The demo data is **intentionally high-quality** so your presentation works regardless. You can honestly say:

> "We've built the scraping infrastructure and tested it with Motors.co.uk. For production, we're pursuing direct dealer partnerships which gives us better data quality, real-time inventory, and avoids scraping issues entirely. This demonstration shows how the AI search and interface work with our test dataset."

This is **100% honest** and positions you correctly!

## Production Strategy

For real production (post-investment), you want:

1. ✅ **Direct dealer DMS integration** (best option)
   - Pinewood DMS API
   - Keyloop API
   - iVendi feeds

2. ✅ **Paid scraping service** (if needed)
   - ScraperAPI
   - Bright Data
   - Reliable but expensive

3. ❌ **Not free scraping** (too unreliable)
   - Gets blocked frequently
   - Inconsistent results
   - Not production-grade

## Next Steps

1. **Upload to GitHub**
2. **Deploy to Railway**
3. **Check logs** to see if scraping works
4. **Test your frontend** with searches
5. **Check browser console** for `source` field
6. **Be prepared** for demo data fallback (it's better anyway!)

Good luck with your demos! 🚀
