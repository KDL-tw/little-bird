#!/bin/bash

# Little Bird Supabase Environment Setup Script

echo "🗄️  Little Bird Supabase Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    echo "Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo "📝 Creating .env.local file..."
echo ""

# Create .env.local template
cat > .env.local << EOF
# Supabase Configuration
# Get these from your Supabase project settings

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EOF

echo "✅ Created .env.local template"
echo ""
echo "🔧 Next steps:"
echo "1. Go to your Supabase project dashboard"
echo "2. Copy your Project URL and anon key"
echo "3. Replace the placeholder values in .env.local"
echo "4. Run the SQL schema in Supabase SQL Editor"
echo "5. Start your dev server: npm run dev"
echo ""
echo "📖 For detailed instructions, see SUPABASE_SETUP.md"
echo ""
echo "🚀 Happy coding!"
