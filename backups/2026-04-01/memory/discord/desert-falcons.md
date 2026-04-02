# Desert Falcons - Channel Memory

## Project Info
- **Live site:** https://desert-falcons.vercel.app
- **Portal:** https://desert-falcons.vercel.app/portal/
- **Repo:** https://github.com/jwebdesignservice/desert-falcons
- **Local path:** `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\desert-falcons`
- **Stack:** HTML/CSS/JS + Supabase (Postgres + Storage)
- **Default branch:** `main`
- **Last updated:** 2026-03-12

## Supabase
- **URL:** https://ehcvjxggkfsdhzraucbz.supabase.co
- **Storage buckets:** `avatars` (profile photos), `resources` (file uploads)
- **Portal roles:** `core_board`, `admin`, `working_group`, `advisor`, `investor`, `general`
- **Admin check:** `['core_board','admin'].includes((profile.role||'').toLowerCase())`

## SQL Files Run (confirmed)
- [x] `portal/supabase-portal-setup.sql` — base schema
- [x] `portal/supabase-discussions-admin.sql` — admin delete on threads/replies
- [x] `portal/supabase-avatars-setup.sql` — avatar_url column + avatars bucket
- [x] `portal/supabase-edit-policies.sql` — admin INSERT/UPDATE/DELETE on events, resources, founders_updates
- [x] `portal/supabase-resources-storage.sql` — storage RLS for resources bucket
- [?] `portal/supabase-admin-rls.sql` — unknown
- [?] `portal/supabase-analytics-setup.sql` — unknown
- [?] `portal/supabase-notifications-setup.sql` — unknown

## File Structure
- `index.html`, `vision.html`, `founders-story.html`, `engineers.html`, `designers.html` — main site pages
- `investors.html` / `investors.css` — investors page (bilingual disclaimer, terms table, FAQ)
- `join.html` / `join.css` / `join-form.js` — join form (?role=investor param supported)
- `privacy-policy.html`, `terms-of-use.html` — legal pages
- `styles.css` / `script.js` — global styles & scripts
- `images/` — assets incl. `dfc-logo.png`, `ev-charging.jpg`, `vision-city.jpg`, `arabic-architecture.jpg`
- `favicon-dfc.png` — active favicon (transparent bg PNG, on all 19 pages)
- `portal/` — 10-page member portal
  - `portal.js` — shared auth/topbar/sidebar/utilities
  - `portal.css` — shared portal styles
  - `index.html` — login
  - `dashboard.html`, `announcements.html`, `updates.html`, `discussions.html`
  - `resources.html`, `directory.html`, `events.html`, `founders-updates.html`, `settings.html`

## Feature Status

### ✅ Complete
- All 9 main site pages
- Full 10-page portal
- Admin CRUD on all content types (announcements, updates, events, resources, founders-updates)
- Admin discussion moderation (delete threads + replies)
- Profile photo upload (avatars bucket → sidebar display)
- Resource file upload (resources bucket + fallback URL paste)
- Edit functionality on all 5 admin content types
- Mobile dropdown fixes (iOS zoom, chevron, touch-action)
- Favicon on all 19 pages
- DFC logo (header, footer, portal sidebar) on all pages
- OG/Twitter social preview meta tags on all 9 main pages
- Real placeholder images (ev-charging, vision-city, arabic-architecture from Unsplash)
- Investors page with bilingual legal disclaimer
- Admin-only RLS policies on events, resources, founders_updates

### 🔲 Not Built (future work)
- Email notifications (requires Resend/SendGrid + Supabase Edge Function)
- First-login welcome/onboarding flow (`first_login` field exists in DB)
- OG banner image (1200×630) — currently uses square DFC logo; just needs an image file

## Recent Commits
- `9674fe5` — file upload to resources + edit on all 5 admin pages
- `6347fd0` — OG social meta tags (all 9 pages) + real placeholder images

## Decisions & Notes
- Admin check: role must be `core_board` or `admin` (lowercase comparison)
- Footer: logo image stacked above text, left-aligned (CSS uses `!important` due to multiple `.footer-logo` blocks)
- Investors CTA links to `join.html?role=investor` (pre-selects investor tab)
- No admin edit on discussions — delete + recreate is the workaround
- LF→CRLF warnings on git push are non-fatal, ignore them
