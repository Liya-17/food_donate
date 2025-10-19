# ⚡ Render.com Quick Start Guide

Quick reference for deploying to Render.com.

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created and connection string ready
- [ ] Cloudinary account set up with credentials
- [ ] Google Maps API key obtained
- [ ] Code pushed to GitHub repository
- [ ] `.env` files in `.gitignore` (never commit secrets!)

---

## 🔑 Environment Variables Needed

### Backend (Web Service)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_minimum_32_characters
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=https://your-frontend-url.onrender.com
GOOGLE_MAPS_API_KEY=your_google_maps_key (optional)
```

### Frontend (Static Site)

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

1. Go to [Render Dashboard](https://dashboard.render.com)
2. New + → Web Service
3. Connect GitHub repo
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add all backend environment variables
6. Click "Create Web Service"
7. **Copy the backend URL** (e.g., `https://food-donation-backend.onrender.com`)

### Step 2: Deploy Frontend

1. New + → Static Site
2. Connect same GitHub repo
3. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add frontend environment variables
   - **Important:** Use backend URL from Step 1 for `VITE_API_URL`
5. Click "Create Static Site"
6. **Copy the frontend URL**

### Step 3: Update Backend CORS

1. Go back to Backend Web Service
2. Environment → Edit `CLIENT_URL`
3. Set to frontend URL from Step 2
4. Save (service will auto-redeploy)

---

## ✅ Test Your Deployment

Visit your frontend URL and test:

1. ✅ Homepage loads
2. ✅ Register new user
3. ✅ Login works
4. ✅ Create donation (donors)
5. ✅ Claim donation (receivers)
6. ✅ Upload images
7. ✅ Google Maps works
8. ✅ Real-time features

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MongoDB Atlas allows IP `0.0.0.0/0` |
| CORS errors | Verify `CLIENT_URL` matches frontend URL exactly |
| Images not uploading | Check Cloudinary credentials |
| Slow first load | Normal on free tier (cold start ~30s) |
| Frontend can't connect | Verify `VITE_API_URL` includes `/api` at end |

---

## 📊 URLs to Save

After deployment, save these:

```
Frontend: https://_____________________.onrender.com
Backend:  https://_____________________.onrender.com
MongoDB:  mongodb+srv://___________________________
```

---

## 🔄 Redeploy After Changes

```bash
git add .
git commit -m "Your changes"
git push
```

Render auto-deploys when you push to `main` branch!

---

## 💡 Pro Tips

1. **Free Tier Limits:**
   - Services sleep after 15 min inactivity
   - 750 hours/month free
   - Cold start adds ~30s delay

2. **Upgrade to Paid ($7/mo):**
   - Always running
   - No cold starts
   - Better for production

3. **Keep Services Awake (Free Tier):**
   - Use [UptimeRobot](https://uptimerobot.com)
   - Ping backend every 5 minutes

4. **Monitor Your App:**
   - Check logs in Render dashboard
   - Set up health checks
   - Monitor MongoDB Atlas metrics

---

## 📞 Support Resources

- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Community: https://community.render.com

---

**Need detailed instructions? See `RENDER_DEPLOYMENT_GUIDE.md`**
