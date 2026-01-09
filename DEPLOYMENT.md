# Deployment Guide

## Deploying to Vercel

This guide will help you deploy the Shamsi Calendar API to Vercel.

### Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Vercel CLI installed: `npm install -g vercel`
3. Git repository (GitHub, GitLab, or Bitbucket)

### Configuration Files

The project includes these Vercel-specific files:

- **`vercel.json`**: Vercel deployment configuration
- **`api/index.ts`**: Serverless function entry point
- **`.vercelignore`**: Files to exclude from deployment

### Environment Variables

Before deploying, set up your environment variables in Vercel:

```bash
# Required Environment Variables
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*

# Optional Environment Variables
PRODUCTION_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Deployment Methods

#### Method 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy to preview**:
   ```bash
   vercel
   ```

3. **Deploy to production**:
   ```bash
   vercel --prod
   ```

#### Method 2: Deploy via Git (Automatic)

1. **Push to GitHub/GitLab/Bitbucket**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project in Vercel Dashboard**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Configure environment variables
   - Click "Deploy"

3. **Automatic deployments**:
   - Every push to `main` branch automatically deploys to production
   - Pull requests create preview deployments

### Post-Deployment

After deployment, your API will be available at:
```
https://your-project-name.vercel.app
```

Test your deployment:
```bash
# Test the API
curl https://your-project-name.vercel.app/api/convert/today

# Test Swagger UI
open https://your-project-name.vercel.app/api-docs
```

### Troubleshooting

#### Common Issues

**1. "fsPath" Error**
- **Cause**: Missing or invalid `vercel.json` file
- **Solution**: Ensure `vercel.json` exists and is properly formatted

**2. Data Files Not Found**
- **Cause**: Data files not included in deployment
- **Solution**: Verify `includeFiles` in `vercel.json` includes `data/**` and `seeds/**`

**3. Module Not Found Errors**
- **Cause**: Missing dependencies in `package.json`
- **Solution**: Ensure all dependencies are listed in `dependencies`, not `devDependencies`

**4. Build Fails**
- **Cause**: TypeScript compilation errors
- **Solution**: Run `npm run build` locally to check for errors

**5. API Routes Not Working**
- **Cause**: Incorrect routing configuration
- **Solution**: Verify `vercel.json` routes are properly configured

#### Debug Mode

Enable debug mode for more detailed logs:

```bash
vercel --debug
```

### Vercel Configuration Details

#### vercel.json Explanation

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",           // Entry point for serverless function
      "use": "@vercel/node",            // Node.js runtime
      "config": {
        "includeFiles": [               // Files to include in deployment
          "data/**",                    // Holiday data
          "seeds/**",                   // Seed data
          "src/**"                      // Source files
        ]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",                   // Match all routes
      "dest": "api/index.ts"            // Forward to serverless function
    }
  ],
  "env": {
    "NODE_ENV": "production"            // Environment variables
  }
}
```

#### api/index.ts Explanation

```typescript
// This file exports the Express app without starting a server
// Vercel handles the server startup automatically
import app from '../src/app';
export default app;
```

### Performance Optimization

1. **Enable Caching**:
   - Add cache headers in your responses
   - Use Vercel's Edge Network for static assets

2. **Monitor Performance**:
   - Check Vercel Analytics dashboard
   - Monitor function execution times
   - Review error logs

3. **Rate Limiting**:
   - The API includes built-in rate limiting
   - Adjust limits in environment variables

### Domains and DNS

#### Add Custom Domain

1. Go to your project in Vercel Dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

#### Example DNS Configuration

```
Type: CNAME
Name: api (or @)
Value: cname.vercel-dns.com
```

### CI/CD Integration

The project is configured for automatic deployments:

- ✅ **Push to main**: Deploys to production
- ✅ **Pull requests**: Creates preview deployments
- ✅ **Commit comments**: Shows deployment status
- ✅ **Tests**: Runs on each deployment (configure in Vercel)

### Security Considerations

1. **Environment Variables**:
   - Never commit `.env` files
   - Use Vercel's environment variable management
   - Different values for preview vs production

2. **CORS Configuration**:
   - Update `CORS_ORIGIN` for production
   - Restrict to your frontend domain

3. **Rate Limiting**:
   - Review and adjust rate limits
   - Monitor for abuse

### Monitoring and Logs

Access logs in Vercel Dashboard:

1. Navigate to your project
2. Click "Deployments"
3. Select a deployment
4. View "Functions" tab for logs

Or use Vercel CLI:
```bash
vercel logs your-deployment-url
```

### Scaling

Vercel automatically handles:
- **Auto-scaling**: Based on traffic
- **Global CDN**: Distributed across regions
- **Zero-downtime**: Deployments without interruption

### Cost

- **Hobby Plan**: Free (includes 100GB bandwidth)
- **Pro Plan**: $20/month (includes 1TB bandwidth)
- **Enterprise**: Custom pricing

Check current usage:
```bash
vercel ls
```

### Support

- **Vercel Documentation**: https://vercel.com/docs
- **Project Issues**: GitHub Issues
- **Community**: Vercel Discord

---

## Alternative Deployment Options

### Deploy to Railway

1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

### Deploy to Render

1. Create account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Add environment variables
5. Deploy

### Deploy to Heroku

1. Install Heroku CLI
2. Create Heroku app:
   ```bash
   heroku create shamsi-calendar-api
   ```
3. Add `Procfile`:
   ```
   web: node dist/app.js
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

### Self-Hosted Deployment

For self-hosting on your own server:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Copy files to server**:
   ```bash
   rsync -av dist/ user@server:/var/www/api/
   rsync -av data/ user@server:/var/www/api/data/
   rsync -av seeds/ user@server:/var/www/api/seeds/
   rsync -av node_modules/ user@server:/var/www/api/node_modules/
   ```

3. **Configure reverse proxy** (nginx):
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start dist/app.js --name shamsi-api
   pm2 startup
   pm2 save
   ```

---

**Last Updated**: January 2026
**Version**: 1.0.0
