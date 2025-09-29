# 🚀 Little Bird Deployment Guide

## Prerequisites
- ✅ Next.js project created
- ✅ All code committed to git
- ✅ GitHub account
- ✅ Vercel account (we'll create this)

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface (Recommended for beginners)

1. **Go to [GitHub.com](https://github.com)**
2. **Sign in** to your account (or create one if needed)
3. **Click the "+" icon** in the top right corner
4. **Select "New repository"**
5. **Fill out the form:**
   - **Repository name:** `little-bird`
   - **Description:** `Political intelligence platform for boutique lobbying firms`
   - **Visibility:** Public (recommended for portfolio)
   - **DO NOT** check any of the initialization options
6. **Click "Create repository"**

### Option B: Using GitHub CLI (if you have it installed)

```bash
gh repo create little-bird --public --description "Political intelligence platform for boutique lobbying firms"
```

## Step 2: Connect Local Repository to GitHub

**Replace `YOUR_USERNAME` with your actual GitHub username:**

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/little-bird.git

# Push your code to GitHub
git push -u origin main
```

## Step 3: Create Vercel Account

1. **Go to [Vercel.com](https://vercel.com)**
2. **Click "Sign Up"**
3. **Choose "Continue with GitHub"** (recommended)
4. **Authorize Vercel** to access your GitHub repositories
5. **Complete your profile** setup

## Step 4: Deploy to Vercel

### Method 1: Import from GitHub (Recommended)

1. **In Vercel dashboard, click "New Project"**
2. **Select "Import Git Repository"**
3. **Find and select your `little-bird` repository**
4. **Configure the project:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
5. **Click "Deploy"**

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: little-bird
# - Directory: ./
# - Override settings? N
```

## Step 5: Configure Environment Variables (if needed)

Currently, Little Bird doesn't require any environment variables, but if you add them later:

1. **Go to your project in Vercel dashboard**
2. **Click "Settings" tab**
3. **Click "Environment Variables"**
4. **Add your variables:**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-api.com`
   - Environment: Production, Preview, Development

## Step 6: Custom Domain (Optional)

1. **In Vercel dashboard, go to your project**
2. **Click "Settings" tab**
3. **Click "Domains"**
4. **Add your custom domain**
5. **Follow DNS configuration instructions**

## Step 7: Verify Deployment

1. **Visit your deployed URL** (e.g., `https://little-bird-abc123.vercel.app`)
2. **Test all features:**
   - ✅ Landing page loads
   - ✅ Dashboard navigation works
   - ✅ Bills tracker functions
   - ✅ Legislator CRM works
   - ✅ Platform Overview modal opens
   - ✅ AI analysis features work

## Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript errors are resolved
   - Check Vercel build logs

2. **Page not found (404):**
   - Verify all pages are in the correct directory structure
   - Check that dynamic routes are properly configured

3. **Styling issues:**
   - Ensure Tailwind CSS is properly configured
   - Check that all CSS files are imported

4. **Environment variables:**
   - Make sure all required env vars are set in Vercel
   - Restart deployment after adding new variables

## Post-Deployment Checklist

- [ ] Landing page loads correctly
- [ ] Dashboard is accessible
- [ ] All navigation links work
- [ ] Bills tracker CRUD operations work
- [ ] Legislator CRM functions properly
- [ ] Platform Overview modal opens
- [ ] AI analysis features work
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable
- [ ] No console errors

## Next Steps After Deployment

1. **Set up analytics** (Google Analytics, Vercel Analytics)
2. **Configure monitoring** (Sentry, LogRocket)
3. **Set up CI/CD** (automatic deployments on git push)
4. **Add custom domain** (if desired)
5. **Set up staging environment** (for testing)

## Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all dependencies are installed
4. Ensure all environment variables are set

---

**Your Little Bird platform will be live at:** `https://little-bird-[random-string].vercel.app`
