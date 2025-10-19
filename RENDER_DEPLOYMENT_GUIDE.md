# 🚀 Deploy Food Donation Platform to Render.com

This guide will walk you through deploying your Food Donation Platform (MERN stack) to Render.com.

---

## 📋 Prerequisites

Before starting, ensure you have:

1. ✅ A [Render.com](https://render.com) account (free tier available)
2. ✅ Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. ✅ MongoDB Atlas account (for database hosting)
4. ✅ Cloudinary account (for image hosting)
5. ✅ Google Maps API key

---

## 🗂️ Project Structure

Your project has two main parts:
- **Backend** (Express.js API) → Deploy as Web Service
- **Frontend** (React + Vite) → Deploy as Static Site

---

## 📝 Step 1: Prepare Your Repository

### 1.1 Create `.gitignore` Files

**Backend `.gitignore`:**
```
node_modules/
.env
uploads/
*.log
.DS_Store
```

**Frontend `.gitignore`:**
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

**Root `.gitignore`:**
```
node_modules/
.env
*.log
.DS_Store
```

### 1.2 Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Food Donation Platform with role-based features"

# Create repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/food-donation.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Step 2: Set Up MongoDB Atlas

If you haven't already:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. Whitelist all IPs: Go to Network Access → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)

---

## 🖥️ Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Log into [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository: `food-donation`

### 3.2 Configure Backend Service

**Settings:**
- **Name:** `food-donation-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** `Free` (or paid for production)

### 3.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Maps (Optional - if using backend geocoding)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Frontend URL (will update after deploying frontend)
CLIENT_URL=https://food-donation-frontend.onrender.com
```

**Important Notes:**
- Generate a strong JWT_SECRET: Use a password generator for 32+ characters
- Replace MongoDB URI with your actual connection string
- Update CLIENT_URL after deploying frontend

### 3.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL: `https://food-donation-backend.onrender.com`

### 3.5 Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see a response indicating the API is running.

---

## 🌐 Step 4: Deploy Frontend to Render

### 4.1 Update Frontend Environment Variable

Before deploying frontend, update the API URL:

**Create/Update `frontend/.env.production`:**
```env
VITE_API_URL=https://food-donation-backend.onrender.com/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Commit and push:**
```bash
git add frontend/.env.production
git commit -m "Add production environment variables"
git push
```

### 4.2 Create Static Site

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Select your repository: `food-donation`

### 4.3 Configure Frontend Service

**Settings:**
- **Name:** `food-donation-frontend`
- **Branch:** `main`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### 4.4 Add Environment Variables (Frontend)

Under **"Advanced"** → **"Environment Variables"**:

```env
VITE_API_URL=https://food-donation-backend.onrender.com/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4.5 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL: `https://food-donation-frontend.onrender.com`

---

## 🔄 Step 5: Update CORS Settings

### 5.1 Update Backend Environment Variable

1. Go back to your **Backend Web Service** on Render
2. Go to **"Environment"** tab
3. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://food-donation-frontend.onrender.com
   ```
4. Click **"Save Changes"** → Service will redeploy

### 5.2 Verify CORS Configuration

Your backend `server.js` should have CORS configured. Ensure it includes:

```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
```

---

## ✅ Step 6: Test Your Deployment

### 6.1 Test Checklist

Visit your frontend URL and test:

- ✅ Homepage loads correctly
- ✅ User registration works
- ✅ User login works
- ✅ Donors can create donations
- ✅ Receivers can view and claim donations
- ✅ Image uploads work (Cloudinary)
- ✅ Google Maps location picker works
- ✅ Real-time notifications work (Socket.io)
- ✅ Role-based features work correctly

### 6.2 Check Backend Health

Visit: `https://your-backend-url.onrender.com/api/auth/test`

Should return API information.

---

## 🔧 Step 7: Custom Domain (Optional)

### 7.1 For Frontend

1. Go to your Frontend Static Site
2. Click **"Settings"** → **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Follow instructions to configure DNS

### 7.2 For Backend

1. Go to your Backend Web Service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your API subdomain (e.g., `api.yourfooddomain.com`)

---

## 📊 Step 8: Monitor Your Application

### 8.1 Render Dashboard

- View logs in real-time
- Monitor CPU/Memory usage
- Check deployment history
- Set up health checks

### 8.2 Enable Auto-Deploy

In Render settings:
- Enable **"Auto-Deploy"** for both services
- Any push to `main` branch will trigger redeployment

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Backend Won't Start

**Error:** "Application failed to respond"

**Solutions:**
1. Check logs in Render dashboard
2. Verify all environment variables are set
3. Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
4. Check `package.json` has correct start script: `"start": "node server.js"`

### Issue 2: Frontend Can't Connect to Backend

**Error:** "Network Error" or CORS errors

**Solutions:**
1. Verify `VITE_API_URL` in frontend environment variables
2. Check backend `CLIENT_URL` includes frontend URL
3. Ensure CORS is properly configured in backend
4. Check browser console for exact error

### Issue 3: Images Not Uploading

**Error:** Cloudinary errors

**Solutions:**
1. Verify Cloudinary credentials in backend environment variables
2. Check Cloudinary account is active
3. Test Cloudinary connection in logs

### Issue 4: Slow Initial Load

**Reason:** Free tier services sleep after 15 minutes of inactivity

**Solutions:**
1. Upgrade to paid tier (keeps services always running)
2. Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes
3. Accept the ~30 second cold start on free tier

### Issue 5: Socket.io Not Working

**Solutions:**
1. Ensure WebSocket support is enabled
2. Check backend allows WebSocket connections
3. Verify `CLIENT_URL` in Socket.io configuration

---

## 🎯 Production Best Practices

### Security

1. ✅ Use strong JWT_SECRET (32+ characters)
2. ✅ Never commit `.env` files
3. ✅ Use HTTPS only (Render provides this automatically)
4. ✅ Enable rate limiting (already in your code)
5. ✅ Keep dependencies updated: `npm audit fix`

### Performance

1. ✅ Enable compression (already in backend)
2. ✅ Optimize images before upload
3. ✅ Use MongoDB indexes for frequent queries
4. ✅ Monitor response times in Render dashboard

### Monitoring

1. Set up health check endpoints
2. Monitor error logs regularly
3. Use Render's built-in metrics
4. Consider adding error tracking (e.g., Sentry)

---

## 📱 Step 9: Post-Deployment Tasks

### Update README

Add your live URLs:
```markdown
## 🔗 Live Demo

- **Frontend:** https://food-donation-frontend.onrender.com
- **Backend API:** https://food-donation-backend.onrender.com
```

### Test User Accounts

Create test accounts for both roles:
1. Test Donor account
2. Test Receiver account

Share credentials with stakeholders for testing.

### Database Backup

Set up regular backups:
1. MongoDB Atlas → Cluster → Backup
2. Enable Continuous Backup
3. Configure backup schedule

---

## 🎉 Deployment Complete!

Your Food Donation Platform is now live on Render.com!

### Next Steps

1. ✅ Test all features thoroughly
2. ✅ Share with users/stakeholders
3. ✅ Monitor logs for errors
4. ✅ Gather user feedback
5. ✅ Iterate and improve

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **MongoDB Atlas Support:** https://www.mongodb.com/cloud/atlas/support
- **Your Backend Logs:** Render Dashboard → Your Service → Logs

---

## 💰 Cost Estimate

### Free Tier (Sufficient for Testing/Small Scale)
- **Backend Web Service:** Free (sleeps after inactivity)
- **Frontend Static Site:** Free
- **MongoDB Atlas:** Free (512 MB storage)
- **Cloudinary:** Free (25 credits/month)
- **Total:** $0/month

### Paid Tier (Production Ready)
- **Backend Web Service:** $7/month (Starter - always running)
- **Frontend Static Site:** Free
- **MongoDB Atlas:** $9/month (2GB storage)
- **Cloudinary:** Free or $0.04/credit
- **Total:** ~$16/month

---

## 🔄 Continuous Deployment Workflow

After initial setup:

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push

# Render automatically detects push and redeploys!
# Frontend: ~2-3 minutes
# Backend: ~5-7 minutes
```

---

**Happy Deploying! 🚀**

Your food donation platform is making the world a better place!
