# Vercel Deployment Guide for AI Career Coach

## 🚀 Quick Fix for Login Issues on Vercel

### Step 1: Environment Variables in Vercel

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

```env
# Database
DATABASE_URL=your_mongodb_connection_string

# Clerk Authentication (CRITICAL)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret

# Clerk URLs (CRITICAL - Must match your Vercel domain)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Inngest (Optional)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### Step 2: Update Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Configure → Domains**
4. Add your Vercel domain: `your-app-name.vercel.app`
5. Make sure the domain is **verified**

### Step 3: Update Clerk URLs in Production

In your Clerk dashboard, update these URLs:
- **Sign-in URL**: `https://your-app-name.vercel.app/sign-in`
- **Sign-up URL**: `https://your-app-name.vercel.app/sign-up`
- **After sign-in URL**: `https://your-app-name.vercel.app/onboarding`
- **After sign-up URL**: `https://your-app-name.vercel.app/onboarding`

### Step 4: Redeploy

After updating environment variables and Clerk settings:
1. Go to Vercel dashboard
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger automatic deployment

## 🔧 Common Issues & Solutions

### Issue 1: "Invalid Clerk Key"
**Solution**: Make sure you're using **production keys** (pk_live_... and sk_live_...) not test keys

### Issue 2: "Domain not allowed"
**Solution**: Add your Vercel domain to Clerk's allowed domains list

### Issue 3: "Redirect URL mismatch"
**Solution**: Update Clerk dashboard URLs to match your Vercel domain exactly

### Issue 4: Environment variables not loading
**Solution**: 
1. Check variable names match exactly (case-sensitive)
2. Redeploy after adding variables
3. Check Vercel function logs for errors

## 📋 Pre-Deployment Checklist

- [ ] Production Clerk keys configured
- [ ] Vercel domain added to Clerk dashboard
- [ ] All environment variables set in Vercel
- [ ] Database connection string updated for production
- [ ] Gemini API key is valid
- [ ] Clerk URLs match your Vercel domain

## 🚨 Important Notes

1. **Never use test keys in production** - Always use `pk_live_` and `sk_live_` keys
2. **Domain must be exact** - `your-app.vercel.app` not `www.your-app.vercel.app`
3. **Redeploy after changes** - Environment variable changes require redeployment
4. **Check Vercel logs** - If issues persist, check function logs in Vercel dashboard

## 🔍 Debugging

If login still doesn't work:
1. Check browser console for errors
2. Check Vercel function logs
3. Verify all environment variables are set
4. Test with a fresh browser session
5. Check Clerk dashboard for any error messages
