# MongoDB Atlas Setup - Quick Guide (5 Minutes)

## Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign In"
3. Create account or login with Google

## Step 2: Create Free Cluster

1. Click **"Build a Database"** or **"Create"**
2. Choose **"M0 FREE"** tier
3. Choose Provider: **AWS**
4. Choose Region: **Closest to you** (e.g., US East, EU West, Asia Pacific)
5. Cluster Name: `Cluster0` (default is fine)
6. Click **"Create Cluster"** (takes 3-5 minutes)

## Step 3: Create Database User

1. **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `jobportal`
5. Password: Click **"Autogenerate Secure Password"**
   - **⚠️ COPY THIS PASSWORD IMMEDIATELY!** You'll need it
   - Or create your own strong password (no special chars like @, #, etc.)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

## Step 4: Allow Network Access

1. **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0`
4. Add comment: "Render deployment"
5. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to **Database** (left sidebar)
2. Wait for cluster to show **"Active"** status
3. Click **"Connect"** button
4. Choose **"Connect your application"**
5. Driver: **Node.js**, Version: **5.5 or later**
6. Copy the connection string:
   ```
   mongodb+srv://jobportal:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Format Connection String

Replace placeholders:
- Replace `<password>` with your actual database password (from Step 3)
- Add database name: Change `/?` to `/jobdb?`

**Final format:**
```
mongodb+srv://jobportal:YourActualPassword@cluster0.xxxxx.mongodb.net/jobdb?retryWrites=true&w=majority
```

**⚠️ Important:**
- No spaces in the connection string
- If password has special characters, URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`

## Step 7: Add to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Select your `job-tdg8` service
3. Click **"Environment"** tab
4. Find `MONGO_URI` or click **"Add Environment Variable"**
5. Key: `MONGO_URI`
6. Value: Paste your full connection string
7. Click **"Save Changes"**
8. Service will redeploy automatically (1-2 minutes)

## Step 8: Verify

After redeploy:
1. Check Render logs for: "✓ MongoDB connected successfully"
2. Test endpoint: `https://job-tdg8.onrender.com/api/jobs`
3. Should return job data (not empty array)

---

## 🎯 Your Connection String Should Look Like:

```
mongodb+srv://jobportal:Abc123xyz@cluster0.ab1cd.mongodb.net/jobdb?retryWrites=true&w=majority
```

**Parts explained:**
- `jobportal` = username
- `Abc123xyz` = your password
- `cluster0.ab1cd.mongodb.net` = your cluster address (unique to you)
- `jobdb` = database name

---

## ✅ Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created and active
- [ ] Database user created with password saved
- [ ] Network access set to 0.0.0.0/0
- [ ] Connection string copied and formatted
- [ ] `<password>` replaced with actual password
- [ ] `/jobdb` added to connection string
- [ ] Connection string added to Render `MONGO_URI`
- [ ] Render service redeployed
- [ ] Logs show "MongoDB connected"
- [ ] API returns job data

---

## 🐛 Troubleshooting

**Error: Authentication failed**
- Wrong password in connection string
- Reset password in MongoDB Atlas → Database Access

**Error: querySrv ENOTFOUND**
- Missing or incorrect connection string format
- Check for typos in connection string

**Error: IP not whitelisted**
- Add 0.0.0.0/0 to Network Access in MongoDB Atlas

---

Need help? Check the Render logs for specific error messages.
