# Frontend Stack Standards

Every new site gets this stack installed from the start.

---

## Core Libraries

### shadcn/ui
Pre-built React components (buttons, modals, forms, dropdowns etc).
Copies components directly into your codebase — you own the code.
Styled with Tailwind.

```bash
npx shadcn@latest init
```

### MagicUI
Animated/visual components (particles, shimmer text, beam effects, animated cards).
Built on Framer Motion. Used for landing pages and wow-factor UI.
Install after shadcn.

```bash
npx magicui-cli@latest init
```

Add individual components as needed:
```bash
npx magicui-cli@latest add shimmer-button
npx magicui-cli@latest add particles
npx magicui-cli@latest add animated-gradient-text
```

### Playwright (optional)
Browser automation and end-to-end testing.
Only add when testing or browser automation is needed.
Install Chromium only to keep disk lean.

```bash
npm install -D @playwright/test
npx playwright install chromium
```

---

## Install Order

1. Next.js + Tailwind (project scaffold)
2. shadcn/ui
3. MagicUI
4. Playwright (only if needed)

---

## Notes

- shadcn and MagicUI are CLI-based — zero runtime bloat, components live in your codebase
- Playwright: ~450MB Chromium download, only uses RAM when actively running
- Always install shadcn before MagicUI

---

*Last updated: 2026-03-19*
