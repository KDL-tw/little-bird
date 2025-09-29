# 🗄️ Supabase Setup for Little Bird

## Quick Setup (5 minutes)

### 1. Connect Your Supabase Account

1. **Go to [supabase.com](https://supabase.com)** and sign in to your existing account
2. **Create a new project** (or use existing):
   - Click "New Project"
   - Choose your organization
   - Name: `little-bird` (or any name you prefer)
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"

### 2. Get Your API Keys

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click "API"** in the left menu
3. **Copy these values:**
   - `Project URL` (looks like: `https://your-project.supabase.co`)
   - `anon public` key (starts with `eyJ...`)

### 3. Set Up Environment Variables

1. **Create `.env.local` file** in your project root:
   ```bash
   touch .env.local
   ```

2. **Add your Supabase credentials:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key-here
   ```

### 4. Set Up Database Tables

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the entire contents** of `supabase-schema.sql` (in your project root)
3. **Paste and run** the SQL in the editor
4. **Click "Run"** - this creates all tables and sample data

### 5. Test the Connection

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit** `http://localhost:3000/dashboard/bills`
3. **You should see** bills loaded from the database (not fake data)

## 🚀 Deploy to Vercel

### 1. Add Environment Variables to Vercel

1. **Go to your Vercel dashboard**
2. **Select your Little Bird project**
3. **Go to Settings → Environment Variables**
4. **Add these variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
5. **Redeploy** your project

### 2. Verify Production

1. **Visit your live Vercel URL**
2. **Check** that bills load from database
3. **Test** adding/editing bills

## 📊 Database Schema

### Tables Created:
- **`bills`** - Colorado legislation tracking
- **`legislators`** - Colorado legislators with relationship data
- **`notes`** - Notes about legislators
- **`meetings`** - Meeting history with legislators
- **`aides`** - Legislative staff contacts
- **`associates`** - Professional associates
- **`affinity_groups`** - Political/advocacy groups

### Sample Data Included:
- ✅ 10 Colorado legislators (real names, districts, committees)
- ✅ 5 sample bills with AI analysis
- ✅ Notes, meetings, aides, associates, and affinity groups
- ✅ Realistic relationship scores and vote alignment

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid API key" error:**
   - Check your `.env.local` file has correct values
   - Make sure no extra spaces in the values
   - Restart your dev server after adding env vars

2. **"Table doesn't exist" error:**
   - Make sure you ran the SQL schema in Supabase
   - Check the SQL ran without errors

3. **"Row Level Security" error:**
   - The schema includes RLS policies
   - If you get permission errors, check RLS is enabled

4. **Vercel deployment fails:**
   - Make sure environment variables are set in Vercel
   - Check the variable names match exactly

### Getting Help:

1. **Check Supabase logs** in your dashboard
2. **Check browser console** for errors
3. **Verify your API keys** are correct
4. **Make sure database tables exist** in Supabase

## 🎯 Next Steps

Once Supabase is connected:

1. **Bills page** will load from database
2. **Legislators page** will be updated next
3. **Real-time updates** will work
4. **Data persists** between sessions
5. **Multiple users** can access the same data

## 🔐 Security Notes

- **Anon key** is safe for client-side use
- **Service role key** (if needed) should be server-side only
- **RLS policies** control data access
- **Environment variables** are not committed to git

---

**Need help?** Check the Supabase docs or create an issue in your project.
