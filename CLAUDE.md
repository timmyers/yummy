# Yummy Garden — Development Guide

## Overview

Yummy Garden is a single-page static app (HTML/CSS/JS) that gamifies meal tracking with a garden-growing theme. Deployed on Cloudflare Pages from GitHub.

## Architecture

- `index.html` — Single page, all sections inline
- `style.css` — All styles, CSS custom properties in `:root`
- `app.js` — All logic, localStorage for persistence

No build step, no frameworks, no dependencies. Keep it that way.

## Design Principles

- **Target audience**: Primarily women building healthy eating habits
- **Tone**: Warm, encouraging, never guilt-inducing or naggy. "Hey lovely" not "You missed a meal!"
- **Aesthetic**: Fruits (🍓🫐🍇🥭🍌), rainbows, sunshine, butterflies, flowers. Soft pastels, pink/peach/mint/lavender palette
- **Gamification**: Light and joyful — garden growth, streaks, butterflies, celebrations. NOT calorie tracking, restrictions, or punishment
- **Simplicity**: Keep the app simple and delightful. No sign-up walls, no complex flows

## Code Conventions

- Vanilla JS, no frameworks
- All data in localStorage under key `yummy-garden-data`
- CSS custom properties for colors (defined in `:root`)
- Emoji-heavy UI — use emoji for icons rather than icon libraries
- Mobile-first responsive design
- Respect `prefers-reduced-motion`

## Deploy

Push to `main` branch on GitHub → Cloudflare Pages auto-deploys. No build command needed.

## Data Structure

```js
{
  meals: { "YYYY-MM-DD": [{ name: string, time: ISO string }] },
  gardenPlants: [{ emoji, x, y, growth, swayOffset }],
  totalMeals: number
}
```
