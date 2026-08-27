# SEO Frontend Decisions

This file records the frontend standard for `unisole-seo`.

## Role

- Public marketing and discovery site.
- Focused on brand pages, program discovery, lead capture, and route-level content.

## Stack

- Vite
- React
- TypeScript
- React Router
- RTK Query when API data is needed
- shadcn/ui
- Tailwind CSS

## Backend Usage

- Primary API group:
  - `/api/public/*`

## Architecture Notes

- Keep the site mostly route-driven and content-led.
- Use lazy loading for pages where it improves performance.
- Keep global state minimal.
- Add Redux Toolkit only if the site grows beyond simple fetched content and local UI state.

## Recommended Folder Shape

- `src/app`
- `src/pages`
- `src/components/ui`
- `src/components/shared`
- `src/api`
- `src/lib`

## SEO-Specific Rules

- Prioritize metadata, crawlability, and clean route structure.
- Avoid overengineering state management.
- Keep public content and layout reusable across landing pages.
