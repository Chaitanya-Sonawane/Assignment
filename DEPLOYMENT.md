# Deployment Guide

## Deploy to Vercel (Frontend)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)

### Steps

1. **Push to GitHub**
   ```bash
   # Create a new repository on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: `.next`
   
3. **Environment Variables**
   Add these in Vercel dashboard under Settings > Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a URL like: `https://your-app.vercel.app`

## Deploy Backend (Python Flask)

### Option 1: Railway.app

1. **Sign up at Railway.app**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend**
   - Root Directory: `backend`
   - Start Command: `python app.py`
   
4. **Environment Variables**
   Add in Railway dashboard:
   ```
   MONGODB_URI=your_mongodb_connection_string
   DATABASE_NAME=rtsp_overlay_db
   COLLECTION_NAME=overlays
   DEBUG=False
   PORT=5000
   ```

5. **Generate Domain**
   - Railway will provide a public URL
   - Copy this URL and add it to Vercel's `NEXT_PUBLIC_API_URL`

### Option 2: Render.com

1. **Sign up at Render.com**
   - Go to https://render.com
   - Sign in with GitHub

2. **Create Web Service**
   - Click "New +" > "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: rtsp-overlay-backend
     - Root Directory: `backend`
     - Runtime: Python 3
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `python app.py`

3. **Environment Variables**
   Same as Railway above

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   # Install from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Procfile in backend folder**
   ```
   web: python app.py
   ```

3. **Deploy**
   ```bash
   cd backend
   heroku login
   heroku create your-app-name
   git subtree push --prefix backend heroku main
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set DATABASE_NAME=rtsp_overlay_db
   heroku config:set DEBUG=False
   ```

## MongoDB Setup (Database)

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your backend

3. **Get Connection String**
   - Click "Connect" > "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

4. **Whitelist IP**
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allow from anywhere)

5. **Use Connection String**
   - Add to your backend environment variables as `MONGODB_URI`

## Update Frontend with Backend URL

After deploying backend, update Vercel environment variable:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Update `NEXT_PUBLIC_API_URL` with your backend URL
5. Redeploy the frontend

## CORS Configuration

Make sure your backend allows requests from your Vercel domain:

In `backend/app.py`:
```python
CORS(app, origins=['https://your-app.vercel.app'])
```

## Testing Deployment

1. Open your Vercel URL
2. Check if frontend loads
3. Try adding an RTSP stream
4. Test overlay functionality
5. Check browser console for any errors

## Troubleshooting

### Frontend Issues
- Check Vercel build logs
- Verify environment variables are set
- Check browser console for errors

### Backend Issues
- Check backend logs in Railway/Render/Heroku
- Verify MongoDB connection string
- Test backend health endpoint: `https://your-backend-url.com/health`

### CORS Errors
- Update CORS origins in backend
- Ensure backend URL is correct in frontend env vars

## Quick Deploy Commands

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# Then deploy via Vercel dashboard
```

## Post-Deployment

1. Test all features
2. Monitor logs for errors
3. Set up custom domain (optional)
4. Enable HTTPS (automatic on Vercel)
5. Set up monitoring/analytics

## Notes

- Frontend (Next.js) deploys to Vercel
- Backend (Flask) deploys to Railway/Render/Heroku
- Database (MongoDB) uses MongoDB Atlas
- All three services need to communicate via HTTPS
- Update CORS and environment variables accordingly
