# Deployment Guide for Vercel

## What Was Fixed

The redirect issue was caused by:
1. Using a basic Supabase client instead of SSR-compatible client
2. Client-side navigation not syncing auth cookies properly

**Changes made:**
- Updated `src/lib/supabase.ts` to use `createBrowserClient` from `@supabase/ssr`
- Changed redirect from `router.push()` to `window.location.href` for proper cookie sync
- Enhanced middleware cookie handling

## Deploy to Vercel

### First Time Deployment

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Fix auth redirect for production"
   git push
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Click "Deploy"

3. **Configure Supabase:**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > URL Configuration
   - Add your Vercel URL to "Site URL" (e.g., `https://your-app.vercel.app`)
   - Add redirect URLs:
     - `https://your-app.vercel.app/auth`
     - `https://your-app.vercel.app/sports`
     - `http://localhost:3000/auth` (for local dev)
     - `http://localhost:3000/sports` (for local dev)

### Update Existing Deployment

After making changes, simply push to your git repository:

```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel will automatically detect the changes and redeploy your app.

### Manual Redeploy

If you need to redeploy without code changes:
1. Go to your project on Vercel dashboard
2. Click on the "Deployments" tab
3. Click the three dots on the latest deployment
4. Select "Redeploy"

### Environment Variables Update

If you need to update environment variables:
1. Go to your project settings on Vercel
2. Click "Environment Variables"
3. Update the values
4. Redeploy (Vercel will prompt you)

## Testing

After deployment, test the login flow:
1. Go to your deployed app URL
2. Navigate to `/auth`
3. Log in with valid credentials
4. Verify redirect to `/sports` works properly

## Troubleshooting

- **Still not redirecting?** Check Supabase redirect URLs match your Vercel domain exactly
- **403 errors?** Verify environment variables are set correctly on Vercel
- **Cookies not persisting?** Ensure your domain is using HTTPS (Vercel provides this automatically)
