# Quick Deployment Steps

Follow these steps to deploy your Food Donation Platform quickly.

## Option 1: One-Click Deploy to Render (Easiest)

### Prerequisites
- GitHub account
- Render account (sign up at render.com)
- MongoDB Atlas database (already configured)

### Steps

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com) and log in
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and set up both services automatically

3. **Set Environment Variables**

   After blueprint is created, add these secrets manually:

   **Backend Service:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CLOUDINARY_CLOUD_NAME`: duz4jag3g
   - `CLOUDINARY_API_KEY`: 911831281314121
   - `CLOUDINARY_API_SECRET`: U2TIptzGZk_AyfwUdcFipBxdrf4

   **Frontend Service:**
   - `VITE_GOOGLE_MAPS_API_KEY`: AIzaSyAtDCAG9agnnMJGrWIXJ1bIerdvoy53dtQ

4. **Update URLs**
   - Once deployed, get the backend URL (e.g., `https://food-donation-backend.onrender.com`)
   - Update frontend environment variables:
     - `VITE_API_URL`: https://YOUR-BACKEND-URL/api
     - `VITE_SOCKET_URL`: https://YOUR-BACKEND-URL
   - Get frontend URL and update backend:
     - `FRONTEND_URL`: https://YOUR-FRONTEND-URL
     - `SOCKET_CORS_ORIGIN`: https://YOUR-FRONTEND-URL
   - Redeploy both services

5. **Done!** Your app is live.

---

## Option 2: Manual Deployment to Render

### Backend Deployment

1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: food-donation-backend
   - **Root Directory**: backend
   - **Build Command**: npm install
   - **Start Command**: npm start
4. Add all environment variables from backend/.env
5. Click "Create Web Service"

### Frontend Deployment

1. Go to Render Dashboard → "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: food-donation-frontend
   - **Root Directory**: frontend
   - **Build Command**: npm install && npm run build
   - **Publish Directory**: dist
4. Add environment variables:
   - VITE_API_URL
   - VITE_SOCKET_URL
   - VITE_GOOGLE_MAPS_API_KEY
5. Click "Create Static Site"

---

## Option 3: Deploy to Vercel (Frontend) + Render (Backend)

### Backend on Render
Follow backend steps from Option 2

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: frontend
   - **Framework Preset**: Vite
   - **Build Command**: npm run build
   - **Output Directory**: dist
5. Add environment variables:
   - VITE_API_URL
   - VITE_SOCKET_URL
   - VITE_GOOGLE_MAPS_API_KEY
6. Click "Deploy"

---

## Important Notes

### Free Tier Limitations
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Consider paid tier for production use

### After Deployment Checklist
- [ ] Test user registration
- [ ] Test login functionality
- [ ] Test donation creation
- [ ] Test image uploads
- [ ] Test real-time notifications
- [ ] Test Google Maps functionality
- [ ] Verify Socket.io connections work

### Troubleshooting
- **API calls fail**: Check CORS settings and environment variables
- **Images don't upload**: Verify Cloudinary credentials
- **Maps don't load**: Check Google Maps API key and enabled APIs
- **WebSocket errors**: Update SOCKET_CORS_ORIGIN with correct frontend URL

---

## Environment Variables Checklist

### Backend
- [x] PORT
- [x] NODE_ENV
- [x] MONGODB_URI
- [x] JWT_SECRET
- [x] JWT_EXPIRE
- [x] CLOUDINARY_CLOUD_NAME
- [x] CLOUDINARY_API_KEY
- [x] CLOUDINARY_API_SECRET
- [x] FRONTEND_URL
- [x] SOCKET_CORS_ORIGIN

### Frontend
- [x] VITE_API_URL
- [x] VITE_SOCKET_URL
- [x] VITE_GOOGLE_MAPS_API_KEY

---

## Getting Help

If you encounter issues:
1. Check service logs in Render/Vercel dashboard
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
4. Check that URLs are correctly configured (no trailing slashes)

For detailed troubleshooting, see DEPLOYMENT_GUIDE.md
