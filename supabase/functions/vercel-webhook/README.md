# Vercel Webhook Function

This function listens for deployment events from Vercel to automatically update your Deploytics dashboard.

## Setup

1.  **Deploy the Function**:
    ```bash
    supabase functions deploy vercel-webhook
    ```
    Note: You must have the Supabase CLI installed and logged in.

2.  **Get the URL**:
    After deployment, Supabase will provide a URL like:
    `https://<project-ref>.supabase.co/functions/v1/vercel-webhook`

3.  **Configure Vercel**:
    - Go to your Vercel Project Settings > Webhooks.
    - Create a new Webhook.
    - URL: Your function URL.
    - Events: Select `Deployment Created`, `Deployment Succeeded` (Ready), `Deployment Failed` (Error).
    - Secret: Copy the "Signing Secret".

4.  **Set Environment Variables**:
    In your Supabase Dashboard > Edge Functions > Secrets, add:
    - `VERCEL_WEBHOOK_SECRET`: The signing secret from step 3.

## Local Development
To run locally:
```bash
supabase functions serve
```
Then use `ngrok` or similar to expose localhost:54321 to Vercel for testing.
