# Security Audit Checklist

## Row Level Security (RLS) ✅
- [x] `projects` - Users can only access their own projects
- [x] `deployments` - Access tied to project ownership
- [x] `integrations` - Per-project with user check
- [x] `alert_rules` - Per-project access
- [x] `subscriptions` - Users can only view/update their own
- [x] `purchases` - Users can only view their own
- [x] `project_members` - Project-scoped access
- [x] `notifications` - Users can only access their own

## API Security ✅
- [x] All API routes check `auth.getUser()` 
- [x] Webhook routes verify signatures (Vercel, Polar)
- [x] Rate limiting utility created
- [x] Security headers configured in `next.config.ts`

## Authentication ✅
- [x] OAuth via Supabase (GitHub, Google)
- [x] Session management via Supabase Auth
- [x] Protected routes via middleware

## Data Handling ✅
- [x] API tokens encrypted at rest (Supabase default)
- [x] No sensitive data in client bundles
- [x] Service role key only on server

## Remaining (Post-Launch)
- [ ] CSRF token for form submissions
- [ ] Content Security Policy (CSP)
- [ ] Regular dependency audits
- [ ] Penetration testing
