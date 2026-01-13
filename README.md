# Whoz Nexx Sports

A Next.js app for sports registration for kids.

## Setup

1. Create a Supabase project at [supabase.com](https://supabase.com).

2. Run the SQL in `schema.sql` in your Supabase SQL editor.

3. Copy your project URL and anon key from Supabase dashboard.

4. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- Parent sign-up and login with email/password
- Select sport: football, baseball, soccer, basketball
- Register kid's info for January 25
- Admin dashboard to view all registrations

## Notifications

To set up notifications for sign-ups:

1. Use Supabase Edge Functions: Create a function that triggers on insert to `kids` table and sends an email.

2. Or use webhooks: Set up a webhook on the `kids` table insert event to call your email service (e.g., SendGrid, Mailgun).

Example Edge Function (in Supabase dashboard > Edge Functions):

```javascript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const { record } = await req.json()

  // Send email notification here
  // Use your email service API

  return new Response(JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

Then, create a database trigger:

```sql
CREATE TRIGGER notify_on_kid_insert
  AFTER INSERT ON kids
  FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request(
    'your-function-url',
    'POST',
    '{"Content-Type":"application/json"}',
    '{}'
  );
```
