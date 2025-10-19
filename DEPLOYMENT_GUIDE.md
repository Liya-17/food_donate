# Food Donation Platform - Deployment Guide

This guide covers deployment options for your MERN stack application.

## Table of Contents
1. [Render Deployment (Recommended)](#render-deployment)
2. [Vercel + Render Deployment](#vercel--render-deployment)
3. [Environment Variables Setup](#environment-variables-setup)
4. [Pre-Deployment Checklist](#pre-deployment-checklist)

---

## Pre-Deployment Checklist

### 1. Prepare Your Code

- [ ] Ensure all code is committed to Git
- [ ] Push to GitHub (create a repository if you haven't)
- [ ] Test the application locally
- [ ] Update environment variables for production

### 2. Create GitHub Repository (if not done)

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for deployment"

# Create a new repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/food-donation-platform.git
git branch -M main
git push -u origin main
```

---

## Render Deployment (Recommended)

Render can host both frontend and backend on the same platform.

### Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Sign up using your GitHub account
3. Authorize Render to access your repositories

### Step 2: Deploy Backend (Web Service)

1. **Click "New +" → "Web Service"**

2. **Connect Repository:**
   - Select your `food-donation-platform` repository

3. **Configure Backend Service:**
   ```
   Name: food-donation-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"

   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://liyamanusreeyarlagadda_db_user:foodiee@cluster0.lbnzrzc.mongodb.net/food-donation?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=9b2ae4fcd7af8640b2e3f5a028c34df8157635a7ea547e552023db098e4e1e2c8d39964b0f1783ea93f354b846376c44d188fcff438583020ce881493b4f69b0
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=duz4jag3g
   CLOUDINARY_API_KEY=911831281314121
   CLOUDINARY_API_SECRET=U2TIptzGZk_AyfwUdcFipBxdrf4
   FRONTEND_URL=https://YOUR_FRONTEND_URL.onrender.com
   SOCKET_CORS_ORIGIN=https://YOUR_FRONTEND_URL.onrender.com
   ```

5. **Click "Create Web Service"**

6. **Note the Backend URL:**
   - After deployment, copy the URL (e.g., `https://food-donation-backend.onrender.com`)

### Step 3: Deploy Frontend (Static Site)

1. **Click "New +" → "Static Site"**

2. **Connect Repository:**
   - Select your `food-donation-platform` repository

3. **Configure Frontend:**
   ```
   Name: food-donation-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variables:**
   ```
   VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com/api
   VITE_SOCKET_URL=https://YOUR_BACKEND_URL.onrender.com
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyAtDCAG9agnnMJGrWIXJ1bIerdvoy53dtQ
   ```

5. **Click "Create Static Site"**

### Step 4: Update CORS Settings

After getting your frontend URL, update the backend environment variables:
- Go to your backend service on Render
- Update `FRONTEND_URL` and `SOCKET_CORS_ORIGIN` with the actual frontend URL
- The service will automatically redeploy

---

## Vercel + Render Deployment

Deploy frontend on Vercel (faster) and backend on Render.

### Backend on Render

Follow [Step 2 from Render Deployment](#step-2-deploy-backend-web-service)

### Frontend on Vercel

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Import Project:**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Environment Variables:**
   ```
   VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com/api
   VITE_SOCKET_URL=https://YOUR_BACKEND_URL.onrender.com
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyAtDCAG9agnnMJGrWIXJ1bIerdvoy53dtQ
   ```

5. **Click "Deploy"**

6. **Update Backend CORS:**
   - Go to Render backend service
   - Update `FRONTEND_URL` with Vercel URL (e.g., `https://food-donation.vercel.app`)
   - Update `SOCKET_CORS_ORIGIN` with the same Vercel URL

---

## Alternative: Railway Deployment

Railway is another excellent option for deploying both services.

### Deploy on Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **New Project → Deploy from GitHub**

3. **Add Backend Service:**
   - Select repository
   - Root directory: `backend`
   - Add all environment variables
   - Railway will auto-detect Node.js

4. **Add Frontend Service:**
   - Click "New Service" in the same project
   - Select same repository
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Start command: `npx serve -s dist -l $PORT`
   - Add environment variables

---

## Environment Variables Setup

### Backend (.env) - Production

```env
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# CORS
FRONTEND_URL=https://your-frontend-url.com
SOCKET_CORS_ORIGIN=https://your-frontend-url.com

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## Post-Deployment Steps

### 1. Test Your Deployment

- [ ] Visit your frontend URL
- [ ] Register a new account
- [ ] Login with existing credentials
- [ ] Create a donation
- [ ] Test real-time features (Socket.io)
- [ ] Test image uploads
- [ ] Test Google Maps functionality

### 2. Monitor Your Application

**Render:**
- Check logs in the Render dashboard
- Monitor service health

**Vercel:**
- Check deployment logs
- Monitor analytics

### 3. Set Up Custom Domain (Optional)

**On Render:**
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

**On Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS

---

## Troubleshooting

### Issue: 500 Errors on API Calls

**Solution:**
- Check backend logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set correctly

### Issue: CORS Errors

**Solution:**
- Update `FRONTEND_URL` in backend to match your actual frontend URL
- Ensure `SOCKET_CORS_ORIGIN` is also updated
- Restart backend service after changes

### Issue: Images Not Uploading

**Solution:**
- Verify Cloudinary credentials
- Check file size limits
- Ensure Cloudinary is configured in backend

### Issue: Google Maps Not Loading

**Solution:**
- Verify API key is correct
- Enable required Google Maps APIs in Google Cloud Console
- Check API key restrictions

### Issue: WebSocket/Socket.io Connection Failed

**Solution:**
- Ensure backend supports WebSocket connections
- Check `VITE_SOCKET_URL` points to backend URL
- Verify CORS settings include Socket.io origin

---

## Free Tier Limitations

### Render Free Tier:
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free

### Vercel Free Tier:
- 100 GB bandwidth/month
- Serverless function execution time: 10 seconds max
- Great for static sites

### Railway Free Tier:
- $5 free credit/month
- Pay as you go after credits exhausted

---

## Upgrade Recommendations

For production use with real users:

1. **Paid Hosting:** Consider upgrading to paid tier for better performance
2. **CDN:** Use Cloudflare for better global performance
3. **Database:** Consider MongoDB Atlas M10+ for production
4. **Monitoring:** Add services like Sentry for error tracking
5. **Analytics:** Add Google Analytics or similar

---

## Need Help?

- Check deployment logs for specific errors
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

---

**Last Updated:** October 2025
