# Deploy to Netlify - Complete Guide

This guide will help you deploy your Job Portal application to Netlify (Frontend) and a backend hosting service.

## 🏗️ Architecture

- **Frontend (Netlify)**: React + Vite application
- **Backend (Railway/Render)**: Express + MongoDB API
- **Database (MongoDB Atlas)**: Cloud database

---

## 📋 Prerequisites

1. ✅ GitHub account with your code pushed
2. ✅ Netlify account (free) - [netlify.com](https://netlify.com)
3. ✅ Backend hosting account (choose one):
   - Railway (recommended) - [railway.app](https://railway.app)
   - Render - [render.com](https://render.com)
   - Cyclic - [cyclic.sh](https://cyclic.sh)
4. ✅ MongoDB Atlas account - [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

---

## Part 1: Deploy Backend First

### Option A: Deploy Backend to Railway (Recommended - Easiest)

1. **Go to [railway.app](https://railway.app)** and sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `job` repository
   - Select the `server` directory as root (or configure later)

3. **Configure Service**
   - Click on the service
   - Go to "Settings" → "Root Directory"
   - Set to: `job/server` (or leave blank if deploying from server folder directly)

4. **Add Environment Variables**
   Go to "Variables" tab and add:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobdb
   JWT_SECRET=your-super-secret-key-here
   PORT=4000
   CLIENT_ORIGIN=https://your-netlify-site.netlify.app
   NODE_ENV=production
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Copy your backend URL (e.g., `https://job-production.up.railway.app`)
   - Note: Railway provides a free tier with $5 monthly credit

### Option B: Deploy Backend to Render

1. **Go to [render.com](https://render.com)** and sign in

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select `job` repository

3. **Configure Service**
   - Name: `job-api`
   - Root Directory: `job/server`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node index.js`

4. **Add Environment Variables**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=4000
   CLIENT_ORIGIN=https://your-netlify-site.netlify.app
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL

---

## Part 2: Setup MongoDB Atlas

1. **Create Account** at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a region close to you
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose password authentication
   - Username: `jobportal`
   - Password: Generate secure password
   - Role: Read and write to any database

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Add: `0.0.0.0/0`
   - ⚠️ For production, restrict to your hosting IPs

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `jobdb`
   - Example: `mongodb+srv://jobportal:yourpassword@cluster0.xxxxx.mongodb.net/jobdb?retryWrites=true&w=majority`

---

## Part 3: Deploy Frontend to Netlify

### Method 1: Deploy via Netlify Website (Easiest)

1. **Go to [netlify.com](https://netlify.com)** and sign in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your `job` repository
   - Authorize Netlify if prompted

3. **Configure Build Settings**
   ```
   Base directory: job/client
   Build command: npm run build
   Publish directory: job/client/dist
   ```

4. **Add Environment Variables**
   - Click "Show advanced"
   - Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```
   (Use the backend URL from Part 1)

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Your site will be live at: `https://random-name-123.netlify.app`

6. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Click "Add custom domain" or "Change site name"
   - Choose a better name: `job-portal-adarsh.netlify.app`

### Method 2: Deploy via Netlify CLI

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to client folder
cd e:\job\job\client

# Login to Netlify
netlify login

# Build the app
npm run build

# Deploy to Netlify
netlify deploy --prod

# Follow the prompts:
# - Create & configure a new site
# - Choose team
# - Site name: job-portal-adarsh (or your preferred name)
# - Publish directory: dist
```

---

## Part 4: Update Backend CORS Origin

After deploying frontend, update your backend's `CLIENT_ORIGIN` environment variable:

**On Railway:**
1. Go to your service → Variables
2. Update `CLIENT_ORIGIN` to: `https://your-site.netlify.app`
3. Redeploy if needed

**On Render:**
1. Go to your service → Environment
2. Update `CLIENT_ORIGIN`
3. Service will auto-redeploy

---

## Part 5: Update Frontend API URL

Make sure your frontend knows where the backend is:

1. **Check `client/.env.production`** exists with:
   ```env
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```

2. **Update `client/src/api/index.js`** to use environment variable:
   ```javascript
   import axios from 'axios';

   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

   const api = axios.create({
     baseURL: `${API_URL}/api`,
     headers: {
       'Content-Type': 'application/json',
     },
   });

   export default api;
   ```

3. **Redeploy Frontend**
   - On Netlify, go to "Deploys" → "Trigger deploy" → "Deploy site"

---

## 🎯 Complete Deployment Checklist

### Backend
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables configured
- [ ] Backend URL copied
- [ ] Test `/api/health` endpoint works

### Frontend
- [ ] Updated `.env.production` with backend URL
- [ ] Updated `api/index.js` to use env variable
- [ ] Code pushed to GitHub
- [ ] Frontend deployed to Netlify
- [ ] Environment variables set in Netlify
- [ ] Site is accessible
- [ ] API calls working

### Final Steps
- [ ] Update backend `CLIENT_ORIGIN` with Netlify URL
- [ ] Test login functionality
- [ ] Test job listings
- [ ] Test admin dashboard
- [ ] Custom domain configured (optional)

---

## 🧪 Testing Your Deployment

1. **Test Backend**
   ```powershell
   # Test health endpoint
   curl https://your-backend-url.up.railway.app/api/health
   
   # Should return: {"status":"ok","time":"2025-11-27T..."}
   ```

2. **Test Frontend**
   - Visit your Netlify URL
   - Check console for API errors (F12)
   - Test navigation
   - Try logging in as admin

3. **Test Database Connection**
   - Jobs should load on homepage
   - Try creating a new job (if admin)

---

## 🐛 Common Issues & Solutions

### Issue: "Network Error" or API calls failing

**Solution:**
1. Check `VITE_API_URL` is correct in Netlify environment variables
2. Verify backend is running (visit `/api/health`)
3. Check CORS - `CLIENT_ORIGIN` must match your Netlify URL exactly
4. Look at browser console for exact error

### Issue: Page shows blank or 404 on refresh

**Solution:**
- Make sure `_redirects` file exists in `client/public/`
- Content should be: `/*    /index.html   200`
- Redeploy frontend

### Issue: "Cannot connect to database"

**Solution:**
1. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Verify `MONGO_URI` is correct (no spaces, correct password)
3. Check MongoDB Atlas cluster is running
4. Check backend logs for detailed error

### Issue: Environment variables not working

**Solution:**
1. In Netlify: Variables must start with `VITE_` for Vite
2. Redeploy after adding variables
3. Clear cache and redeploy: "Deploys" → "Trigger deploy" → "Clear cache and deploy site"

### Issue: Build fails on Netlify

**Solution:**
1. Check Node version matches your local (18+)
2. Verify all dependencies are in `package.json`
3. Check build command is correct: `npm run build`
4. Check base directory is set to `job/client`

---

## 🚀 Quick Deploy Commands

**One-line deploy:**
```powershell
cd e:\job\job\client; npm run build; netlify deploy --prod --dir=dist
```

**Redeploy frontend:**
```powershell
cd e:\job\job\client; git add .; git commit -m "update"; git push
# Or trigger deploy in Netlify dashboard
```

---

## 📱 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://job-portal-adarsh.netlify.app`
- **Backend API**: `https://job-production.up.railway.app`
- **Admin Panel**: `https://job-portal-adarsh.netlify.app/admin`
- **API Health**: `https://job-production.up.railway.app/api/health`

---

## 💰 Pricing

- **Netlify**: Free (100GB bandwidth, unlimited builds)
- **Railway**: $5/month credit (free tier)
- **Render**: Free tier available (sleeps after 15 min inactivity)
- **MongoDB Atlas**: Free (M0 cluster, 512MB storage)

**Total cost**: $0 - $5/month

---

## 🔄 Continuous Deployment

Once set up, any push to GitHub will:
1. Auto-deploy frontend on Netlify
2. Auto-deploy backend on Railway/Render

Just push your code:
```powershell
git add .
git commit -m "your changes"
git push origin main
```

---

## 📞 Need Help?

Check logs:
- **Netlify**: Site settings → Build & deploy → Deploy logs
- **Railway**: Service → Deployments → Click deployment → Logs
- **Render**: Service → Logs tab

---

Good luck with your deployment! 🎉
