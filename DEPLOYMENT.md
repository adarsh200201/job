# Deployment Guide

This guide covers deploying your Job Portal application to live hosting platforms.

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get your connection string

2. **GitHub Repository** (Already set up)
   - Make sure all code is pushed to: https://github.com/adarsh200201/job.git

---

## Option 1: Deploy to Vercel (Recommended for beginners)

Vercel is great for React apps and provides serverless functions for the backend.

### Steps:

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "New Project"
   - Select your `job` repository
   - Root Directory: `job` (select the job folder)

3. **Configure Environment Variables**
   Click "Environment Variables" and add:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key_here
   NODE_ENV=production
   CLIENT_ORIGIN=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Your site will be live at `https://your-app.vercel.app`

### Commands to Deploy from CLI:
```powershell
cd e:\job\job
npm install -g vercel
vercel login
vercel
```

---

## Option 2: Deploy to Render (Free tier with backend)

Render provides free hosting for both frontend and backend with better backend support than Vercel.

### Steps:

1. **Sign up/Login to Render**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub

2. **Create MongoDB Database** (if you haven't)
   - Use MongoDB Atlas (free)
   - Get connection string

3. **Deploy Using Blueprint**
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select `job` repository
   - Render will detect `render.yaml` automatically

4. **Configure Environment Variables**
   In Render dashboard, add:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - Other variables are auto-configured via render.yaml

5. **Deploy**
   - Click "Apply"
   - Wait 5-10 minutes for both services to deploy
   - Your API will be at: `https://job-api.onrender.com`
   - Your frontend will be at: `https://job-client.onrender.com`

### Manual Deployment (Alternative):
If blueprint doesn't work, create services manually:

**Backend Service:**
- Type: Web Service
- Build Command: `npm install`
- Start Command: `node server/index.js`

**Frontend Service:**
- Type: Static Site
- Build Command: `cd client && npm install && npm run build`
- Publish Directory: `client/dist`

---

## Option 3: Deploy to Netlify + Railway

### Netlify (Frontend):
```powershell
cd e:\job\job\client
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

### Railway (Backend):
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Set root directory to `job/server`
5. Add environment variables

---

## Environment Variables Reference

Create these on your hosting platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/jobdb` |
| `JWT_SECRET` | Secret key for JWT tokens | `my-super-secret-key-12345` |
| `PORT` | Server port (auto-set by host) | `4000` |
| `CLIENT_ORIGIN` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `NODE_ENV` | Environment | `production` |

---

## Update API URL in Frontend

After deploying backend, update the API URL:

1. Create `e:\job\job\client\.env.production`:
```env
VITE_API_URL=https://your-backend-url.com
```

2. Update `client/src/api/index.js` to use this environment variable

---

## MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all - for production, restrict this)
5. Get connection string from "Connect" button
6. Replace `<password>` and `<dbname>` in connection string

---

## Troubleshooting

### Issue: Backend can't connect to frontend
- **Solution**: Update `CLIENT_ORIGIN` environment variable with your frontend URL

### Issue: Database connection fails
- **Solution**: Check MongoDB Atlas IP whitelist and connection string

### Issue: Build fails
- **Solution**: Ensure all dependencies are in `package.json`, not dev dependencies

### Issue: API requests fail
- **Solution**: Update `VITE_API_URL` in frontend environment variables

---

## Quick Deploy Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] Backend deployed and responding to /api/health
- [ ] Frontend deployed
- [ ] Frontend API URL updated to backend URL
- [ ] Test the live website

---

## Recommended: Vercel + MongoDB Atlas

**Easiest setup:**
1. Deploy entire app to Vercel
2. Use MongoDB Atlas for database
3. Set environment variables in Vercel dashboard
4. Done! ✅

**Your live URLs will be:**
- Main site: `https://job-adarsh200201.vercel.app`
- API: `https://job-adarsh200201.vercel.app/api`

---

Need help? Check the terminal output for specific errors and refer to the hosting platform's documentation.
