#!/bin/bash

# Little Bird Deployment Script
# This script helps you deploy to GitHub and Vercel

echo "🚀 Little Bird Deployment Script"
echo "================================"
echo ""

# Check if git is configured
if ! git config user.name > /dev/null 2>&1; then
    echo "❌ Git is not configured. Please run:"
    echo "   git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your.email@example.com'"
    exit 1
fi

echo "✅ Git is configured"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

echo "✅ In git repository"
echo ""

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Your commit message'"
    exit 1
fi

echo "✅ Working tree is clean"
echo ""

# Check if remote origin exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote origin is already configured"
    echo "   Remote URL: $(git remote get-url origin)"
    echo ""
    echo "To push your code:"
    echo "   git push -u origin main"
else
    echo "❌ No remote origin configured"
    echo ""
    echo "Please create a GitHub repository first, then run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/little-bird.git"
    echo "   git push -u origin main"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Create GitHub repository at https://github.com/new"
echo "2. Add remote origin: git remote add origin https://github.com/YOUR_USERNAME/little-bird.git"
echo "3. Push code: git push -u origin main"
echo "4. Go to https://vercel.com and import your GitHub repository"
echo "5. Deploy! 🎉"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
