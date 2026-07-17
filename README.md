# CareerOS

A unified placement-prep dashboard built with React — track DSA practice, company applications, interview notes, personal projects, and daily goals in one place, styled like a lightweight operating system.

**Live demo:** [jaindhruv04.github.io/careeros](https://jaindhruv04.github.io/careeros/)

## Overview

Students preparing for placements usually juggle separate tools for DSA tracking, company applications, interview notes, personal projects, and daily goals. CareerOS combines all of these into a single dashboard, with a Dashboard view that aggregates live data across every tracker — high-priority items, success rates, recent activity, and quick insights — pulled automatically from whatever you've logged elsewhere in the app.

This project was built incrementally as a hands-on way to learn React fundamentals — state, Context API, React Router, controlled forms, and array/object immutability — with each feature added only after understanding the concept behind it, not just copy-pasting a pattern.

## Features

- **Dashboard** — overall stats, high-priority triage across all trackers, progress rates (with visual bars), a merged recent-activity feed, and a daily goals checklist
- **Company Tracker** — log applications with role, status, priority, and notes; search and filter by name, status, and priority
- **DSA Tracker** — log problems with topic, difficulty, status, and a revision-needed flag; search and filter by name, difficulty, revision status, and priority
- **Interview Journal** — log interview rounds with questions asked, your answers, mistakes, and lessons learned; search and filter by company, round, and priority
- **Project Tracker** — log personal projects with tech stack, progress percentage, and status; search and filter by name, status, and priority

## Tech stack

- **React** (Vite) — component structure and hooks
- **Tailwind CSS v4** — styling, via the official Vite plugin
- **React Router** — client-side routing across all pages
- **Context API** — shared state across sibling routes, split one context per tracker
- **useState** + controlled components — all forms and local UI state

All data currently lives in React state only — no backend, no database. Data resets on refresh by design in this version.

## Architecture

```
src/
  context/
    CompanyContext.jsx
    DSAContext.jsx
    InterviewContext.jsx
    ProjectContext.jsx
  components/
    Navbar.jsx
    ModuleHeader.jsx
    PriorityBadge.jsx
  pages/
    Dashboard.jsx
    CompanyTracker.jsx
    DSATracker.jsx
    InterviewJournal.jsx
    ProjectTracker.jsx
  utils/
    dashboardUtils.js
    dateUtils.js
  App.jsx
  main.jsx
```

Each tracker's data lives in its own Context, since the four datasets change independently and are mostly consumed by their own page. The Dashboard reads from all four via `useContext`, since it's a sibling route rather than a parent of the tracker pages — props alone can't bridge that gap, which is what makes Context necessary here rather than optional.

## Getting started

```bash
git clone https://github.com/jaindhruv04/careeros.git
cd careeros
npm install
npm run dev
```

## Deployment

Deployed via GitHub Pages using `gh-pages`. Two things make client-side routing work correctly on a static host:

- `base: "/careeros/"` set in `vite.config.js`, matching the GitHub Pages subpath
- `basename="/careeros"` set on `BrowserRouter`, plus a `404.html` redirect script so hard refreshes on non-root routes don't 404

## Roadmap

- `useReducer` for more complex state transitions (edit/delete)
- Form validation with React Hook Form + Zod
- Authentication and protected routes
- Pagination / infinite scroll for longer lists
- TanStack Query, as groundwork for a future backend (Node/Express + MongoDB)

## Author

Built by Dhruv Jain — B.Tech IT student, BPIT (GGSIPU Delhi) — as a hands-on React learning project alongside DSA and placement prep.