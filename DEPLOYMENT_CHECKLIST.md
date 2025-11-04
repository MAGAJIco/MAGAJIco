
# Deployment Checklist for Replit

## Pre-Deployment

- [ ] Install Python dependencies: `pip install -r requirements.txt`
- [ ] Install Node dependencies: `npm install`
- [ ] Build Next.js: `npm run build`
- [ ] Test backend: `npm run api:start` (should run on port 8000)
- [ ] Test frontend: `npm run start` (should run on port 5000)
- [ ] Configure environment variables in Replit Secrets
- [ ] Remove corrupted favicon: `rm -f src/app/favicon.ico`

## Environment Variables (Replit Secrets)

Required:
- `BACKEND_URL` = `http://127.0.0.1:8000`
- `NEXT_PUBLIC_API_URL` = `http://127.0.0.1:8000`

Optional (Premium Features):
- `RAPIDAPI_KEY` = your_key_here
- `ODDS_API_KEY` = your_key_here
- `FOOTBALL_DATA_API_KEY` = your_key_here

## Deployment Configuration

- **Build Command**: `npm run build`
- **Run Command**: `npm run start`
- **Type**: Autoscale Deployment (recommended) or Reserved VM
- **Port**: 5000 (forwarded to 80/443)

## Backend Setup

The Python backend runs separately on port 8000:
- Start with: `python -m uvicorn main:app --host 0.0.0.0 --port 8000`
- Or use workflow: "Start Both Servers"

## Post-Deployment

- [ ] Verify frontend loads at your-app.replit.app
- [ ] Test API endpoints: `/api/nfl`, `/api/nba`, `/api/mlb`, `/api/soccer`
- [ ] Check backend health: `http://your-backend:8000/health`
- [ ] Monitor logs for errors
- [ ] Test all locale routes: /en, /es, /fr, /de
- [ ] Verify predictions page works
- [ ] Test live matches page

## Scaling Considerations

### Autoscale (Recommended)
- Scales down to save costs when idle
- Scales up to handle traffic spikes
- Best for websites and APIs
- Cost: Pay per usage

### Reserved VM
- Always-on dedicated VM
- Predictable costs
- Best for background jobs or bots
- Cost: Fixed monthly

## Troubleshooting

### "Module not found: lucide-react"
Run: `npm install lucide-react`

### "uvicorn not found"
Run: `pip install -r requirements.txt`

### Port 5000 in use
- Stop other workflows
- Check for zombie processes
- Restart deployment

### 404 on matches page
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Restart deployment

## Monitoring

- Use Replit Analytics for traffic monitoring
- Check Deployment logs for errors
- Monitor resource usage in deployment dashboard
- Set up uptime monitoring (external service)
