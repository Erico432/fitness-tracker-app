# Deployment TODO List

## Preparation Steps
- [x] Update frontend API base URL for production
- [ ] Ensure backend environment variables are set for production
- [x] Add production start script to backend if needed
- [ ] Build frontend for production

## Backend Deployment (Railway)
- [ ] Create Railway account and project
- [ ] Connect GitHub repository to Railway
- [ ] Set environment variables in Railway (MONGO_URI, JWT_SECRET, NODE_ENV=production)
- [ ] Deploy backend to Railway
- [ ] Note the deployed backend URL (e.g., https://your-app-name.up.railway.app)

## Frontend Deployment (Netlify)
- [ ] Create Netlify account and site
- [ ] Connect GitHub repository to Netlify
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `build`
- [ ] Set environment variable: REACT_APP_API_URL to Railway backend URL
- [ ] Deploy frontend to Netlify
- [ ] Note the deployed frontend URL

## Post-Deployment
- [ ] Test live application functionality
- [ ] Update README.md with live demo links
- [ ] Configure custom domain if desired
