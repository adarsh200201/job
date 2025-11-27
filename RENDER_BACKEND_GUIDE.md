# Deploy Backend to Render - Complete Guide

This guide will walk you through deploying your Job Portal backend API to Render.

## 🎯 What You'll Deploy

- **Backend API**: Express.js + MongoDB
- **Database**: MongoDB Atlas (free tier)
- **Hosting**: Render (free tier available)

---

## 📋 Prerequisites

1. ✅ GitHub account with your code pushed
2. ✅ Render account (free) - [render.com](https://render.com)
3. ✅ MongoDB Atlas account - [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

---

## Part 1: Setup MongoDB Atlas (Database)

### Step 1: Create Account & Cluster

1. **Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)**
   - Sign up for free or log in

2. **Create a New Cluster**
   - Click "Create" or "Build a Database"
   - Choose **FREE** tier (M0 Sandbox)
   - Select a cloud provider: AWS
   - Choose a region closest to you (e.g., US East, EU West, Asia Pacific)
   - Cluster Name: `Cluster0` (default is fine)
   - Click "Create Cluster" (takes 3-5 minutes)

### Step 2: Create Database User

1. **Go to Database Access** (left sidebar)
   - Click "Add New Database User"
   
2. **Set Authentication**
   - Authentication Method: Password
   - Username: `jobportal` (or any username you prefer)
   - Password: Click "Autogenerate Secure Password" or create your own
   - **⚠️ SAVE THIS PASSWORD** - you'll need it for the connection string
   
3. **Set User Privileges**
   - Database User Privileges: **Read and write to any database**
   - Click "Add User"

### Step 3: Configure Network Access

1. **Go to Network Access** (left sidebar)
   - Click "Add IP Address"

2. **Allow Access from Anywhere** (for development/deployment)
   - Click "Allow Access from Anywhere"
   - This adds `0.0.0.0/0` to the IP whitelist
   - Add description: "Render deployment"
   - Click "Confirm"
   - ⚠️ **For production**: You can restrict this to Render's IP ranges later

### Step 4: Get Connection String

1. **Go to Database** (left sidebar)
   - Your cluster should show as "Active"
   - Click "Connect" button

2. **Choose Connection Method**
   - Select "Connect your application"
   - Driver: **Node.js**
   - Version: **5.5 or later**

3. **Copy Connection String**
   ```
   mongodb+srv://jobportal:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Update Connection String**
   - Replace `<password>` with your actual database user password
   - Add database name: change `/?` to `/jobdb?`
   - Final format:
   ```
   mongodb+srv://jobportal:YourPassword123@cluster0.xxxxx.mongodb.net/jobdb?retryWrites=true&w=majority
   ```
   - **⚠️ SAVE THIS** - you'll need it for Render

---

## Part 2: Deploy Backend to Render

### Method 1: Deploy via Render Dashboard (Recommended)

#### Step 1: Sign Up & Connect GitHub

1. **Go to [render.com](https://render.com)**
   - Click "Get Started" or "Sign Up"
   - Sign up with GitHub (recommended)
   - Authorize Render to access your repositories

#### Step 2: Create New Web Service

1. **Click "New +" (top right)**
   - Select "Web Service"

2. **Connect Repository**
   - Find and select your `job` repository
   - Click "Connect"

#### Step 3: Configure Service

Fill in the following settings:

**Basic Settings:**
```
Name: job-api
Region: Oregon (US West) - or closest to you
Branch: main
Root Directory: (leave blank or set to "job")
```

**Build & Deploy:**
```
Runtime: Node
Build Command: cd server && npm install
Start Command: cd server && npm start
```

**Instance Type:**
```
Plan: Free (or Starter if you need always-on)
```

#### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these variables one by one:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `MONGO_URI` | `mongodb+srv://jobportal:YourPassword@cluster0.xxxxx.mongodb.net/jobdb?retryWrites=true&w=majority` |
| `JWT_SECRET` | Click "Generate" or use a secure random string |
| `CLIENT_ORIGIN` | `https://your-netlify-site.netlify.app` (update after Netlify deploy) |

**⚠️ Important:**
- Replace `MONGO_URI` with YOUR actual MongoDB connection string from Part 1
- Replace `CLIENT_ORIGIN` with your actual Netlify URL (or leave as `*` temporarily)

#### Step 5: Deploy

1. **Click "Create Web Service"**
   - Render will start building and deploying
   - This takes 3-5 minutes
   - Watch the logs in real-time

2. **Wait for "Live" Status**
   - Your service URL will be shown at the top
   - Format: `https://job-api-xxxx.onrender.com`
   - **⚠️ COPY THIS URL** - you'll need it for Netlify

#### Step 6: Test Your Backend

1. **Test Health Endpoint**
   - Visit: `https://your-app.onrender.com/api/health`
   - You should see: `{"status":"ok","time":"2025-11-28T..."}`

2. **If it works** ✅ - Backend is deployed successfully!

3. **If you see errors** ❌ - Check the logs:
   - Go to your service → "Logs" tab
   - Look for connection errors or missing environment variables

---

### Method 2: Deploy via Render Blueprint (Alternative)

If you want automated deployment:

1. **Ensure `render.yaml` is in your repository**
   - Already created in `job/render.yaml`

2. **Go to Render Dashboard**
   - Click "New +" → "Blueprint"

3. **Connect Repository**
   - Select your `job` repository
   - Render will detect `render.yaml`

4. **Update Environment Variables**
   - In the blueprint setup, add your `MONGO_URI`
   - Update `CLIENT_ORIGIN` with your Netlify URL

5. **Click "Apply"**
   - Render will create and deploy the service automatically

---

## Part 3: Update Frontend with Backend URL

After your backend is deployed on Render:

### Update Netlify Environment Variables

1. **Go to Netlify Dashboard**
   - Select your deployed site
   - Go to "Site settings" → "Environment variables"

2. **Update or Add Variable**
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-app.onrender.com/api`
   - (Replace with your actual Render URL + `/api`)

3. **Trigger Redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

### Update Backend CORS

1. **Go to Render Dashboard**
   - Select your `job-api` service
   - Go to "Environment" tab

2. **Update `CLIENT_ORIGIN`**
   - Change from temp value to your actual Netlify URL
   - Example: `https://job-portal-adarsh.netlify.app`
   - Click "Save Changes"
   - Service will auto-redeploy

---

## 🧪 Testing Your Deployment

### Test Backend Endpoints

1. **Health Check**
   ```powershell
   curl https://your-app.onrender.com/api/health
   ```
   Expected: `{"status":"ok","time":"..."}`

2. **Jobs Endpoint**
   ```powershell
   curl https://your-app.onrender.com/api/jobs
   ```
   Expected: Array of job listings

3. **Test in Browser**
   - Open your Netlify site
   - Check browser console (F12)
   - Jobs should load
   - No CORS errors

---

## 🎯 Complete Deployment Checklist

### MongoDB Atlas
- [ ] Cluster created and active
- [ ] Database user created with password
- [ ] Network access set to 0.0.0.0/0
- [ ] Connection string copied and saved
- [ ] Connection string tested locally (optional)

### Render Backend
- [ ] Web service created
- [ ] Repository connected
- [ ] Root directory set to `job/server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] All environment variables added
- [ ] Service deployed and showing "Live"
- [ ] Health endpoint responds correctly
- [ ] Backend URL copied

### Netlify Frontend
- [ ] Site deployed
- [ ] `VITE_API_BASE_URL` updated with Render URL
- [ ] Frontend redeployed
- [ ] Site loads without errors
- [ ] API calls working

### Final Integration
- [ ] Backend `CLIENT_ORIGIN` updated with Netlify URL
- [ ] Test login functionality
- [ ] Test job listings
- [ ] Test admin dashboard
- [ ] Check for CORS errors (should be none)

---

## 🐛 Common Issues & Solutions

### Issue: "MongoServerError: Authentication failed"

**Cause:** Incorrect MongoDB credentials

**Solution:**
1. Go to MongoDB Atlas → Database Access
2. Verify username and password
3. Reset password if needed
4. Update `MONGO_URI` in Render with new password
5. Redeploy service

---

### Issue: "MongooseServerSelectionError: Could not connect"

**Cause:** Network access not configured or wrong connection string

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Ensure `0.0.0.0/0` is whitelisted
3. Verify connection string format:
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```
4. Check for special characters in password (URL encode them)
5. Test connection locally first

---

### Issue: "CORS Policy Error" in browser console

**Cause:** Backend `CLIENT_ORIGIN` doesn't match frontend URL

**Solution:**
1. Go to Render → Your service → Environment
2. Update `CLIENT_ORIGIN` to exact Netlify URL (no trailing slash)
3. Example: `https://job-portal.netlify.app`
4. Wait for auto-redeploy
5. Clear browser cache and refresh

---

### Issue: Backend returns "Cannot GET /api/health"

**Cause:** Routes not properly configured

**Solution:**
1. Check Render logs for errors
2. Verify `Start Command` is: `npm start`
3. Check `server/index.js` has routes defined
4. Ensure all dependencies installed (check build logs)

---

### Issue: "Service Unavailable" or frequent timeouts

**Cause:** Free tier services sleep after 15 minutes of inactivity

**Solution:**
1. This is normal for Render free tier
2. First request after sleep takes 30-60 seconds to wake up
3. Options:
   - Upgrade to Starter plan ($7/month) for always-on
   - Use a service like [UptimeRobot](https://uptimerobot.com) to ping every 14 minutes
   - Accept the cold start delay

---

### Issue: Environment variables not working

**Cause:** Variables not properly set or service not redeployed

**Solution:**
1. Go to Render → Environment tab
2. Verify all variables are present
3. Click "Save Changes" if you modified them
4. Manually trigger redeploy if needed:
   - Go to "Manual Deploy" → "Deploy latest commit"

---

### Issue: Build fails with "Module not found"

**Cause:** Missing dependencies in package.json

**Solution:**
1. Check build logs for specific missing module
2. Verify `server/package.json` includes all dependencies
3. Make sure it's in `dependencies`, not `devDependencies`
4. Push updated package.json to GitHub
5. Render will auto-redeploy

---

## 💰 Render Pricing

**Free Tier:**
- ✅ 750 hours/month (enough for one service 24/7)
- ✅ Automatic SSL
- ✅ Automatic deploys
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ 30-50 second cold start time

**Starter Tier ($7/month):**
- ✅ Always-on (no sleep)
- ✅ Faster builds
- ✅ More RAM/CPU

---

## 🔄 Continuous Deployment

Once set up, Render automatically deploys when you push to GitHub:

```powershell
# Make changes to your code
cd e:\job\job

# Commit and push
git add .
git commit -m "Update backend"
git push origin main

# Render will automatically:
# 1. Detect the push
# 2. Build your service
# 3. Deploy new version
# 4. Show in logs
```

---

## 📊 Monitoring Your Service

### View Logs
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. See real-time logs

### Check Metrics
1. Click "Metrics" tab
2. View CPU, Memory, Request rate
3. Monitor for errors

### Set Up Alerts (Optional)
1. Go to service → "Settings"
2. Add notification email
3. Get alerts for failures

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files to GitHub
   - Use strong, unique `JWT_SECRET`
   - Regularly rotate secrets

2. **MongoDB**
   - Use strong database password
   - For production, restrict IP whitelist
   - Enable MongoDB Atlas audit logs

3. **CORS**
   - Set `CLIENT_ORIGIN` to exact frontend URL
   - Don't use `*` in production

4. **Rate Limiting**
   - Consider adding rate limiting middleware
   - Protect against DDoS attacks

---

## 📱 Your Live URLs

After complete deployment:

| Service | URL |
|---------|-----|
| **Backend API** | `https://job-api-xxxx.onrender.com` |
| **Health Check** | `https://job-api-xxxx.onrender.com/api/health` |
| **Jobs Endpoint** | `https://job-api-xxxx.onrender.com/api/jobs` |
| **Admin Endpoint** | `https://job-api-xxxx.onrender.com/api/admin` |
| **Frontend** | `https://your-site.netlify.app` |
| **Admin Panel** | `https://your-site.netlify.app/admin` |

---

## 🎓 Additional Resources

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Production Checklist](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

## 🚀 Quick Reference Commands

**Test Backend Locally:**
```powershell
cd e:\job\job\server
npm install
npm start
# Visit: http://localhost:4000/api/health
```

**Generate JWT Secret:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Check Service Status:**
```powershell
curl https://your-app.onrender.com/api/health
```

---

## ✅ Success Checklist

Your deployment is successful when:

- [ ] MongoDB Atlas cluster shows "Active"
- [ ] Render service shows "Live" status
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Jobs endpoint returns job data
- [ ] Frontend can fetch jobs from backend
- [ ] No CORS errors in browser console
- [ ] Admin login works
- [ ] Can create/edit/delete jobs via admin panel

---

**Need Help?**

1. Check Render logs for specific errors
2. Verify all environment variables are set correctly
3. Test each component individually (DB → Backend → Frontend)
4. Check MongoDB Atlas connection
5. Verify CORS settings match exactly

---

Good luck with your deployment! 🎉

Your backend will be live at: `https://job-api-[random].onrender.com`
