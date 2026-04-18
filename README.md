# Hakka Lab — Restaurant Brand Website

A bilingual (Chinese / English) restaurant brand website for **Hakka Lab (客味實驗室)**, a contemporary Hakka cuisine concept. Built as a portfolio project with a focus on visual storytelling, scroll-driven animation, and a full reservation management system.

## Live Demo
https://restaurant-brand-website.vercel.app

---

## Features

- **Bilingual support** — full Chinese and English translations across all pages, with a language switcher in the navbar and a first-visit language selection screen
- **Loading screen** — spinning SVG circle with brand text on entry
- **Scroll-driven animations** — hero parallax, story text line-reveal, and a three-column image/text scroll sequence, all built with GSAP + ScrollTrigger
- **Seasonal menu** — filterable menu by category with crossfade category images and vegetarian/vegan badges
- **Online reservation system** — full CRUD: submit a booking, look up by code, edit details, and cancel
- **Floating navbar** — morphs into a pill shape on scroll using GSAP

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, story teaser, three-column value section, CTA |
| `/menu` | Seasonal menu with category filter |
| `/story` | Brand story |
| `/reservation` | Make a reservation / look up an existing one |
| `/reservation/success` | Booking confirmation with reservation code |

## Built With

| | |
|---|---|
| [Vue 3](https://vuejs.org) | Component framework — `<script setup>` + TypeScript |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [GSAP 3](https://gsap.com) | Scroll-driven and timeline animations (ScrollTrigger) |
| [Vue Router 4](https://router.vuejs.org) | Client-side routing |
| [Supabase](https://supabase.com) | Backend and database (PostgreSQL) for reservations |
| [Vite 6](https://vite.dev) | Build tool and dev server |
| ChatGPT | Content writing and menu design |
| Claude.ai | AI-assisted ideation and development support |

## Project Structure

```
src/
├── components/
│   ├── NavBar.vue              # Sticky nav with lang switcher + scroll morph
│   ├── HeroSection.vue         # Full-screen hero with scroll-out animation
│   ├── StorySection.vue        # Text line-reveal + photo slide-up
│   ├── ThreeColumnSection.vue  # Pinned scroll section cycling 3 image+text rows
│   ├── CtaSection.vue          # Call-to-action with intersection fade-in
│   ├── FooterSection.vue       # Footer with nav groups and social links
│   ├── LangSplash.vue          # First-visit language selection screen
│   └── LoadingScreen.vue       # Entry loading animation (spinning SVG circle)
├── views/
│   ├── HomeView.vue
│   ├── StoryView.vue
│   ├── MenuView.vue
│   ├── ReservationView.vue
│   └── ReservationSuccessView.vue
├── composables/
│   └── useLang.ts              # Singleton lang state, setLang(), t() helper
├── i18n/
│   └── index.ts                # All zh/en translation strings
├── lib/
│   └── supabase.ts             # Supabase client + Reservation type
└── router/
    └── index.ts
```

## Internationalization

Language state is managed as a module-level singleton in `src/composables/useLang.ts`. The selected language is persisted to `localStorage`. All translation strings live in `src/i18n/index.ts`.

To add a new language, add a new key to the `translations` object in `index.ts` and extend the `Lang` type — no other changes required.

## License

This project is for portfolio and demonstration purposes.
