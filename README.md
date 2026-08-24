# CareerOS

A unified placement-preparation dashboard built with React. CareerOS helps students track DSA practice, company applications, interview notes, personal projects, and daily goals in one place.

**Live frontend:** https://careeros-dwui.onrender.com

**Backend API:** https://careeros-api-0zqj.onrender.com

---

## Overview

Students preparing for placements often use separate tools for DSA tracking, company applications, interview notes, project planning, and daily goals. CareerOS brings these workflows into one focused dashboard.

The Dashboard aggregates live data from every tracker, including high-priority items, progress rates, recent activity, and quick insights. The project was built incrementally while learning React fundamentals, with every feature implemented after understanding the underlying concept.

## Features

### Dashboard

- Overall statistics across all trackers
- High-priority task triage
- Progress summaries with visual progress bars
- Recent activity feed
- Quick insights
- Session-based daily goals checklist

### Company Tracker

- Track job applications
- Edit, archive, restore, and delete entries
- Manage application status and priority
- Search and filter entries

### DSA Tracker

- Track solved DSA problems
- Store difficulty, topic, status, and revision flag
- Edit, archive, restore, and delete entries
- Search and filter entries

### Interview Journal

- Store interview experiences
- Record questions asked, answers, mistakes, and lessons learned
- Assign priorities
- Search and filter entries

### Project Tracker

- Track personal projects
- Store progress percentage and technology stack
- Manage project status and priority
- Edit, archive, restore, and delete entries

### Browser Persistence

- Company, DSA, interview, and project data is saved in browser `localStorage`
- Tracker data remains available after refreshing or reopening the browser
- Daily goals are currently session-based and reset after a refresh

## Tech Stack

- React
- Vite
- Tailwind CSS v4
- React Router
- Context API
- Browser `localStorage`
- Node.js / Express backend
- Prisma / PostgreSQL
- Render

## React Concepts Used

- Functional components
- JSX
- Props
- Controlled components
- `useState`
- `useReducer`
- `useEffect`
- Context API
- React Router
- Conditional rendering
- Rendering lists with `map()`
- Filtering with `filter()`
- Immutable state updates
- Object and array spreading
- Local persistence with `localStorage`

## Data Flow and Persistence

Each tracker has its own Context Provider.

State is managed using `useReducer` and synchronized with browser `localStorage` using `useEffect`.

```text
User action
    ↓
dispatch()
    ↓
Reducer updates state
    ↓
React re-renders
    ↓
useEffect runs
    ↓
localStorage updates
```

When the application starts, previously saved tracker data is loaded back into React automatically.

## Project Structure

```text
src/
│
├── components/
├── context/
├── pages/
├── utils/
├── App.jsx
└── main.jsx

server/
├── controllers/
├── middleware/
├── prisma/
├── routes/
└── app.js
```

## Getting Started

```bash
git clone https://github.com/jaindhruv04/careeros.git
cd careeros
npm install
npm run dev
```

For the backend:

```bash
cd server
npm install
npm start
```

The frontend API URL is configured through the `VITE_API_URL` environment variable. The backend accepts its frontend origin through `CLIENT_ORIGIN`.

## Deployment

CareerOS is deployed using Render.

- Frontend: `https://careersos-dwui.onrender.com`
- Backend API: `https://careersos-api-0zqj.onrender.com`

The frontend uses the root Vite base path (`/`) and standard `BrowserRouter` routing, so it is not tied to the old GitHub Pages `/careeros/` path.

## Future Improvements

- Persistent daily goals
- Responsive mobile improvements
- Export and import data
- Analytics dashboard

## Author

**Dhruv Jain**  
B.Tech Information Technology  
BPIT, GGSIPU Delhi

Built as a practical React learning project while preparing for software engineering placements.
