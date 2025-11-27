# Backend Deployment Quick Start (Render)

## 🚀 5-Minute Deploy Guide

### Prerequisites
- MongoDB Atlas account (free)
- Render account (free)
- Your code on GitHub

---

## Step 1: MongoDB Atlas (3 minutes)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Create database user:
   - Username: `jobportal`
   - Password: Generate secure password (save it!)
4. Network Access: Add `0.0.0.0/0` (allow all)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy string and replace:
     - `<password>` with your password
     - Add `/jobdb` before the `?`
   - Final format:
     ```
     mongodb+srv://jobportal:YourPass123@cluster0.xxxxx.mongodb.net/jobdb?retryWrites=true&w=majority
     ```

---

## Step 2: Deploy to Render (2 minutes)

1. Go to [render.com](https://render.com) → Sign in with GitHub

2. Click **"New +"** → **"Web Service"**

3. Connect your `job` repository

3. Configure:
   ```
   Name: job-api
   Root Directory: (leave blank)
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```

5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string from Step 1
   - `JWT_SECRET`: Click "Generate" button
   - `CLIENT_ORIGIN`: `https://your-netlify-site.netlify.app`
   - `NODE_ENV`: `production`
   - `PORT`: `4000`

6. Click **"Create Web Service"** → Wait 3-5 minutes

7. Copy your URL: `https://job-api-xxxx.onrender.com`

---

## Step 3: Test Your Backend

Visit: `https://your-app.onrender.com/api/health`

✅ Should return: `{"status":"ok","time":"2025-11-28T..."}`

---

## Step 4: Connect to Frontend

In Netlify:
1. Site settings → Environment variables
2. Update `VITE_API_BASE_URL` to: `https://your-app.onrender.com/api`
3. Trigger redeploy

Done! 🎉

---

## 📚 Full Documentation

For detailed instructions, troubleshooting, and best practices, see:
- **[RENDER_BACKEND_GUIDE.md](RENDER_BACKEND_GUIDE.md)** - Complete deployment guide
- **[NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)** - Frontend deployment guide

---

## 🐛 Quick Troubleshooting

**MongoDB connection fails?**
- Check password is correct (no special chars issues)
- Verify `0.0.0.0/0` in Network Access
- Check connection string format

**CORS errors?**
- Update `CLIENT_ORIGIN` in Render with exact Netlify URL
- No trailing slash
- Redeploy if needed

**Service sleeping?**
- Normal for free tier
- First request takes 30-60 seconds to wake
- Upgrade to Starter plan ($7/mo) for always-on

---

## 📱 Your URLs

After deployment:
- **Backend API**: `https://job-api-xxxx.onrender.com`
- **Health Check**: `https://job-api-xxxx.onrender.com/api/health`
- **Jobs API**: `https://job-api-xxxx.onrender.com/api/jobs`
