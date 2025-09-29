# Complete Supabase Setup for Little Bird

## 🚀 Quick Setup Guide

### 1. Environment Variables

Create a `.env.local` file in your project root with these values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ahlfdjlyfrrrntgleszh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobGZkamx5ZnJycm50Z2xlc3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMTc4NzksImV4cCI6MjA3NDY5Mzg3OX0.w6OcF_eubIQD6CtxouR7hGFxBV0LPtk8qhy8LETAmhw

# OpenStates API
NEXT_PUBLIC_OPENSTATES_API_KEY=7fffc14f-6f2d-4168-ac04-628867cec6b1
```

### 2. Database Setup

1. Go to your Supabase project: https://supabase.com/dashboard/project/ahlfdjlyfrrrntgleszh
2. Navigate to **SQL Editor**
3. Copy the entire contents of `database-setup-complete.sql`
4. Paste and run the SQL script

### 3. Verify Setup

After running the SQL script, you should have these tables:
- ✅ `bills` - Colorado legislation with AI analysis
- ✅ `legislators` - Legislators with social handles and contact info
- ✅ `bill_sponsors` - Links bills to legislators
- ✅ `intelligence_signals` - Twitter/YouTube monitoring data
- ✅ `meeting_notes` - CRM meeting notes with action items
- ✅ `notes` - Legacy notes (for compatibility)
- ✅ `meetings` - Legacy meetings (for compatibility)
- ✅ `aides` - Legislative aides
- ✅ `associates` - Legislative associates
- ✅ `affinity_groups` - Affinity groups

### 4. Test Data Persistence

1. Start your dev server: `npm run dev`
2. Go to `/dashboard/sources`
3. Click "Sync Now" on the Official Legislative Data source
4. Go to `/dashboard/bills` - you should see real Colorado bills
5. Go to `/dashboard/legislators` - you should see real Colorado legislators
6. Refresh the page - data should persist!

## 🔧 What's Included

### Essential Tables Created:

1. **bills** - Complete Colorado legislation tracking
   - Bill number, title, sponsor, status
   - Position tracking (Support/Monitor/Oppose)
   - AI analysis JSON field
   - Timestamps and updates

2. **legislators** - Complete legislator profiles
   - Contact information (phone, email, office)
   - Social handles (Twitter, Facebook, website)
   - Committee assignments
   - Relationship scoring
   - Topics of interest

3. **bill_sponsors** - Bill-legislator relationships
   - Links bills to legislators
   - Sponsor types (Primary, Co-sponsor, Co-prime)
   - Proper foreign key relationships

4. **intelligence_signals** - Social media monitoring
   - Source types (Twitter, YouTube, News, Press Release)
   - Content and sentiment analysis
   - Relevance scoring
   - Entity extraction
   - Links to bills and legislators

5. **meeting_notes** - Advanced CRM features
   - Meeting types (In-person, Phone, Video, etc.)
   - Attendees and action items
   - Follow-up tracking
   - Outcome recording
   - Author tracking

### Sample Data Included:

- 10 Colorado legislators with real names and districts
- 5 Colorado bills with realistic data
- Bill sponsor relationships
- Sample intelligence signals
- Sample meeting notes
- Sample aides, associates, and affinity groups

## 🎯 Next Steps

1. **Run the SQL script** in Supabase
2. **Create `.env.local`** with the values above
3. **Test the sync** in `/dashboard/sources`
4. **Verify data persistence** by refreshing pages
5. **Deploy to Vercel** when ready

## 🚨 Important Notes

- The SQL script will **clear existing data** and insert fresh sample data
- All tables have **Row Level Security (RLS)** enabled with permissive policies
- The OpenStates API key is included for immediate testing
- All foreign key relationships are properly set up
- Indexes are created for optimal performance

## 🔍 Troubleshooting

If you encounter issues:

1. **Check environment variables** - Make sure `.env.local` exists and has correct values
2. **Verify Supabase connection** - Check the Supabase dashboard for errors
3. **Check console logs** - Look for API errors in browser console
4. **Test database connection** - Run `npm run dev` and check for connection errors

The system is now ready for production use with real Colorado legislative data! 🎉
