# DevPulse

**Your Unified DevOps Dashboard** - Monitor GitHub, Vercel, Supabase, and more in one place.

## Features

- 📊 **Real-time Deployment Tracking** - Monitor builds across all platforms
- 💰 **Cost Awareness** - Track spending before bills surprise you
- 🔔 **Instant Alerts** - Get notified for failed deployments
- 👥 **Team Collaboration** - Role-based access for your team
- 🔌 **Multi-Platform** - GitHub, Vercel, Supabase, Netlify, Railway, Render

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (Postgres + RLS)
- **Auth**: Supabase Auth (OAuth)
- **Payments**: Polar.sh
- **UI**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/S3OD177/Deploytics.git
cd Deploytics
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Polar.sh (Optional - for payments)
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_PRO_PRODUCT_ID=
POLAR_ENTERPRISE_PRODUCT_ID=
POLAR_ADDON_5_PRODUCT_ID=
POLAR_ADDON_10_PRODUCT_ID=

# Webhooks
VERCEL_WEBHOOK_SECRET=
```

### 3. Database Migrations

Apply migrations to your Supabase project:

```bash
npx supabase db push
```

Or run each migration file in `supabase/migrations/` manually.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Webhook Setup

Configure webhooks in your providers:

- **Vercel**: Settings → Webhooks → Add `https://your-domain.com/api/webhooks/vercel`
- **Polar.sh**: Developers → Webhooks → Add `https://your-domain.com/api/webhooks/polar`

## Pricing

| Plan | Price | Projects | Team |
|------|-------|----------|------|
| Free | $0 | 3 | 1 |
| Pro | $9/mo | 10 | 5 |
| Enterprise | $29/mo | 25 | 15 |

**Add-ons**: +5 Projects ($19), +10 Projects ($29)

## License

MIT

---

Built with ❤️ using Next.js and Supabase
