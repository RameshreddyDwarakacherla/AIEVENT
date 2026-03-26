# AI Event Planner - Deployment Guide

## 🚀 Deployment Options

This guide covers multiple deployment strategies for your AI Event Planner application.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
Ensure your environment variables are properly configured:

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-domain.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2. Build the Frontend
```bash
cd frontend
npm run build
```

## 🌐 Option 1: Vercel (Recommended for Frontend) + Railway (Backend)

### Frontend Deployment on Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy Frontend:**
```bash
cd frontend
vercel --prod
```

3. **Configure Environment Variables in Vercel:**
- Go to your Vercel dashboard
- Add environment variables:
  - `VITE_API_URL`: Your backend URL
  - `VITE_GOOGLE_CLIENT_ID`: Your Google Client ID

### Backend Deployment on Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login and Deploy:**
```bash
cd backend
railway login
railway init
railway up
```

3. **Add Environment Variables in Railway:**
- Go to Railway dashboard
- Add all your backend environment variables

## 🐳 Option 2: Docker Deployment

### Create Docker Files

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## ☁️ Option 3: AWS Deployment

### Backend on AWS Elastic Beanstalk

1. **Install EB CLI:**
```bash
pip install awsebcli
```

2. **Initialize and Deploy:**
```bash
cd backend
eb init
eb create production
eb deploy
```

### Frontend on AWS S3 + CloudFront

1. **Build and Upload:**
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

2. **Configure CloudFront for SPA routing**

## 🔧 Option 4: Heroku Deployment

### Backend on Heroku

1. **Create Heroku App:**
```bash
cd backend
heroku create your-app-name-backend
```

2. **Set Environment Variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set GOOGLE_CLIENT_ID=your_google_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. **Deploy:**
```bash
git push heroku main
```

### Frontend on Netlify

1. **Build and Deploy:**
```bash
cd frontend
npm run build
```

2. **Drag and drop the `dist` folder to Netlify**

3. **Configure redirects for SPA:**
Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

## 🗄️ Database Options

### 1. MongoDB Atlas (Recommended)
- Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster
- Get connection string
- Add to your environment variables

### 2. Self-hosted MongoDB
- Deploy MongoDB on your server
- Configure connection string

## 🔐 Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use platform-specific environment variable management

2. **CORS Configuration:**
   - Update CORS settings in backend for production domains

3. **HTTPS:**
   - Ensure both frontend and backend use HTTPS in production

4. **API Rate Limiting:**
   - Implement rate limiting for production

## 🚀 Quick Deploy Script

Create this script for easy deployment:

**deploy.sh:**
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Deploy to your chosen platform
echo "🌐 Deploying..."

# Example for Vercel + Railway
cd frontend && vercel --prod
cd ../backend && railway up

echo "✅ Deployment complete!"
```

## 📊 Monitoring and Maintenance

1. **Set up monitoring:**
   - Use services like New Relic, DataDog, or built-in platform monitoring

2. **Log management:**
   - Configure proper logging for production

3. **Backup strategy:**
   - Regular database backups
   - Code repository backups

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check frontend URL in backend CORS configuration
   - Verify environment variables

2. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Database Connection:**
   - Verify MongoDB connection string
   - Check network access rules

## 📞 Support

If you encounter issues:
1. Check the deployment platform's logs
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity

---

Choose the deployment option that best fits your needs and budget. Vercel + Railway is recommended for beginners, while AWS provides more control for advanced users.