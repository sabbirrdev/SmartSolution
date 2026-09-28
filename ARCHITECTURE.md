# Smart Solution — Refactored Architecture

## Localization
- `lib/i18n.js` is the single translation dictionary.
- `LocaleContext` in `app/page.jsx` provides the active language to every reusable UI component and tool.
- Bengali (`bn`) is the default language.
- English (`en`) is the secondary language.
- Tool headings, navigation, controls, calculators, legal templates, AI output and profile UI use the same translation function.

## Themes
- `lib/themes.js` contains the supported palette definitions and safe-theme fallback.
- Available themes: Ocean Blue, Warm Cream, Soft Rose, Lavender, Mint, Studio Dark, Graphite Blue.
- Invalid persisted theme values automatically fall back to Ocean Blue.

## Navigation
- Desktop: collapsible icon rail with persistent state.
- Mobile: slide-in drawer.
- The same `Sidebar` component is reused for both layouts.

## Ads
- AdSense publisher: `ca-pub-6608561249557105`.
- Auto Ads loader is placed directly in the document `<head>` to avoid Next.js `data-nscript` attributes.
- The dashboard does not manually push an Auto Ads `<ins>` element, preventing the `All 'ins' elements ... already have ads` error.
- `components/AdSense.jsx` is available for a future manual ad slot when a real `data-ad-slot` ID is supplied.
- `public/ads.txt` is included.

## Components
- `components/AdSense.jsx` — reusable manual AdSense slot.
- `lib/i18n.js` — localization data/helpers.
- `lib/themes.js` — theme registry/helpers.
- `app/page.jsx` — shared shell plus reusable tool components. The tools are rendered independently, so the dashboard is not the only place where functionality exists.


## Current shell
- Desktop navigation is a collapsible sticky rail with its own scroll container.
- Mobile navigation is an independently scrolling slide-in drawer.
- The footer always credits Development by MSR Technologies.
- PC Builder has been removed from the product surface.
- `/login` and `/register` are standalone localized pages; the dashboard no longer uses an authentication modal.
- Dark theme uses shared CSS variables for foreground/muted/control colors.
