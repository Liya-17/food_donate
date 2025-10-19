# Deployment Checklist

Use this checklist to ensure a smooth deployment of your Food Donation Platform.

## Pre-Deployment

### 1. Code Preparation
- [ ] All features are working locally
- [ ] Database is set to `food-donation` (not `test`)
- [ ] All environment variables are documented
- [ ] Code is committed to Git
- [ ] Repository is pushed to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Database Setup
- [ ] MongoDB Atlas cluster is running
- [ ] Database user credentials are correct
- [ ] Network access allows connections from anywhere (0.0.0.0/0)
- [ ] Database name is `food-donation`
- [ ] All users and data are migrated

### 3. Third-Party Services
- [ ] Cloudinary account is set up
- [ ] Cloudinary credentials are available
- [ ] Google Maps API key is created
- [ ] Required Google Maps APIs are enabled:
  - Maps JavaScript API
  - Geocoding API
  - Places API

---

## Deployment Steps

### Method 1: Using render.yaml (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Deploy on Render**
   - [ ] Go to [render.com](https://render.com)
   - [ ] Click "New +" → "Blueprint"
   - [ ] Select your repository
   - [ ] Render auto-detects `render.yaml`

3. **Add Sensitive Environment Variables**

   **Backend Service:**
   - [ ] MONGODB_URI
   - [ ] JWT_SECRET
   - [ ] CLOUDINARY_CLOUD_NAME
   - [ ] CLOUDINARY_API_KEY
   - [ ] CLOUDINARY_API_SECRET

   **Frontend Service:**
   - [ ] VITE_GOOGLE_MAPS_API_KEY

4. **Update Service URLs**
   - [ ] Copy backend URL (e.g., `https://food-donation-backend.onrender.com`)
   - [ ] Update frontend env vars:
     - VITE_API_URL
     - VITE_SOCKET_URL
   - [ ] Copy frontend URL
   - [ ] Update backend env vars:
     - FRONTEND_URL
     - SOCKET_CORS_ORIGIN
   - [ ] Trigger manual redeploy for both services

### Method 2: Manual Deployment

**Backend:**
- [ ] Create new Web Service on Render
- [ ] Set root directory: `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Add all environment variables
- [ ] Deploy

**Frontend:**
- [ ] Create new Static Site on Render
- [ ] Set root directory: `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Add environment variables
- [ ] Deploy

---

## Post-Deployment Testing

### 1. Backend Health Check
- [ ] Visit: `https://your-backend-url.onrender.com/api/health`
- [ ] Should return: `{"success": true, "message": "Server is running"}`

### 2. Frontend Access
- [ ] Visit your frontend URL
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools (F12)

### 3. Authentication Testing
- [ ] Register a new account
- [ ] Verify registration successful
- [ ] Logout
- [ ] Login with registered account
- [ ] Login with existing account (e.g., demo@example.com)

### 4. Feature Testing
- [ ] Create a new donation
- [ ] Upload an image (test Cloudinary)
- [ ] View donation list
- [ ] View donation details
- [ ] Google Maps displays correctly
- [ ] Location picker works
- [ ] Search/filter donations
- [ ] Claim a donation (as receiver)
- [ ] View dashboard statistics

### 5. Real-time Features
- [ ] Open app in two browser windows
- [ ] Login as different users
- [ ] Create donation in one window
- [ ] Verify notification appears in other window
- [ ] Test chat/messaging functionality

### 6. Mobile Testing
- [ ] Open on mobile browser
- [ ] UI is responsive
- [ ] All features work on mobile

---

## Troubleshooting

### Backend Issues

**Service won't start:**
- Check logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string

**500 Errors:**
- Check backend logs
- Verify MongoDB Atlas network access
- Check CORS configuration

**Images not uploading:**
- Verify Cloudinary credentials
- Check file size limits
- Review backend logs

### Frontend Issues

**Blank page:**
- Check browser console for errors
- Verify build completed successfully
- Check environment variable names (must start with `VITE_`)

**API calls failing:**
- Verify VITE_API_URL is correct
- Check backend is running
- Verify CORS settings on backend

**Google Maps not loading:**
- Check API key is correct
- Verify required APIs are enabled
- Check browser console for specific errors

**WebSocket/Socket.io errors:**
- Verify VITE_SOCKET_URL points to backend
- Check SOCKET_CORS_ORIGIN on backend matches frontend URL
- Ensure WebSocket connections are allowed

---

## Performance Optimization

### After Successful Deployment

- [ ] Enable caching headers
- [ ] Optimize images with Cloudinary transformations
- [ ] Consider using CDN for static assets
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)

### Free Tier Optimization

**Render Free Tier:**
- Services sleep after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up

**Solutions:**
- Use a service like cron-job.org to ping your backend every 14 minutes
- Upgrade to paid tier for always-on service
- Show loading message to users on cold start

---

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Environment variables are not committed to Git
- [ ] CORS is properly configured
- [ ] MongoDB Atlas has IP whitelist or network security
- [ ] API rate limiting is enabled
- [ ] Input validation is working
- [ ] XSS protection is enabled (helmet.js)

---

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Check MongoDB Atlas storage usage
- [ ] Review Cloudinary usage and storage
- [ ] Update dependencies monthly
- [ ] Backup database regularly

### Update Deployment
```bash
# Make changes to code
git add .
git commit -m "Update: description of changes"
git push origin main

# Render auto-deploys on push to main branch
```

---

## Support Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Google Maps API:** https://developers.google.com/maps/documentation

---

## Deployment Complete!

Once all items are checked:
- [ ] Application is live and accessible
- [ ] All features are working
- [ ] Performance is acceptable
- [ ] Error monitoring is set up
- [ ] Documentation is updated with live URLs

**Congratulations on deploying your Food Donation Platform! 🎉**
