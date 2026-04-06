---
name: improve
description: Pick and implement one improvement to the Yummy Garden app, test it, and deploy
user_invocable: true
---

# /improve — Yummy Garden Improvement Loop

You are improving the Yummy Garden app at /Users/tim/workspace/yummy.

## Context

Yummy Garden is a static HTML/CSS/JS app that helps users (primarily women) build healthy eating habits through cute garden-growing gamification. The aesthetic is fruits, rainbows, sunshine, butterflies, flowers — soft pastels, pink/peach/mint/lavender palette.

## Principles

- **Less is more.** Prefer polishing and consolidating existing features over adding new ones. Don't be afraid to cut, simplify, or merge things.
- **Warm and encouraging, never guilt-inducing.** "Hey lovely" not "You missed a meal!"
- **Mobile-first.** Most users are on phones.
- **No frameworks, no build step.** Vanilla HTML/CSS/JS only.

## What to improve

Pick ONE thing from this priority list (skip items that are already done):

1. **Bug fixes** — Fix any broken functionality
2. **Visual polish** — Animations, spacing, color consistency, mobile UX
3. **Consolidation** — Merge overlapping features, remove bloat, simplify code
4. **Engagement** — Features that encourage consistent eating (not calorie counting)
5. **Social** — Sharing, community, friend features
6. **DevEx** — Testing, CI, tooling improvements

## Process

1. Read the current state of the app files to understand what exists
2. Pick one focused improvement (not a grab bag of changes)
3. Implement it cleanly in the existing files
4. Run `/simplify` to review changed code for reuse, quality, and efficiency
5. Run `npm test` in /Users/tim/workspace/yummy — fix any failures
6. Add test coverage for new features in test-e2e.js
7. Bump the version in index.html (the `.version-indicator` div) — use semver:
   - Patch (x.y.Z) for bug fixes and polish
   - Minor (x.Y.0) for new features
   - Major (X.0.0) for breaking changes
8. Stage, commit with a descriptive message, and push:

```
git add <changed files>
git commit -m "<description>

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
git push origin main
```
