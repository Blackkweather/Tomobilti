# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register_free
2. Sign up for free account (25GB storage, 25GB bandwidth/month)
3. Verify your email

## Step 2: Get Your Credentials
1. Login to Cloudinary Dashboard
2. Go to Dashboard → Account Details
3. Copy these values:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Update .env File
Add your Cloudinary credentials to `.env`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here
```

## Step 4: Test Upload
Start your server and test the upload endpoint:

```bash
npm run dev
```

Upload test:
```bash
curl -X POST http://localhost:5000/api/upload/car-images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "images=@/path/to/image.jpg"
```

## Usage in Frontend

### Upload Component Example:
```tsx
const handleImageUpload = async (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

  const response = await fetch('/api/upload/car-images', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const { urls } = await response.json();
  // urls = ['https://res.cloudinary.com/...', ...]
};
```

## Image URLs
Cloudinary returns URLs like:
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/sharewheelz/cars/abc123.jpg
```

Store these URLs in your database `cars.images` array.

## Features Included
- ✅ Automatic image optimization
- ✅ Resizing to 1200x800
- ✅ Quality: auto
- ✅ Organized in `sharewheelz/cars` folder
- ✅ Global CDN delivery
- ✅ Multiple image upload (up to 10)

## Production Deployment
Add environment variables to Render:
1. Go to Render Dashboard → Your Service
2. Environment → Add Environment Variables
3. Add:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
