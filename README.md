# CareerOS

A unified placement-prep dashboard built with React that helps track DSA practice, company applications, interview notes, personal projects, and daily goals in one place, styled like a lightweight operating system.

**Live demo:** https://jaindhruv04.github.io/careeros/

---

## Overview

Students preparing for placements usually juggle separate tools for DSA tracking, company applications, interview notes, personal projects, and daily goals. CareerOS combines all of these into a single dashboard, with a Dashboard view that aggregates live data across every tracker, including high-priority items, progress rates, recent activity, and quick insights.

The project was built incrementally while learning React fundamentals. Every feature was implemented only after understanding the underlying concept rather than copying patterns, making the project both a learning journey and a practical placement companion.

---

## Features

- **Dashboard**
  - Overall statistics
  - High-priority triage across all trackers
  - Progress summaries with visual progress bars
  - Recent activity feed
  - Daily goals checklist

- **Company Tracker**
  - Track applications
  - Edit, archive, restore, and delete entries
  - Status management
  - Priority levels
  - Search and filtering

- **DSA Tracker**
  - Track solved problems
  - Difficulty, topic, status, and revision flag
  - Edit, archive, restore, and delete entries
  - Search and filtering

- **Interview Journal**
  - Store interview experiences
  - Questions asked
  - Your answers
  - Mistakes and lessons learned
  - Priority management
  - Search and filtering

- **Project Tracker**
  - Track personal projects
  - Progress percentage
  - Tech stack
  - Status management
  - Edit, archive, restore, and delete entries
  - Search and filtering

- **Persistent browser storage**
  - All trackers automatically save using `localStorage`
  - Data remains available after refreshing or reopening the browser

---

## Tech Stack

- **React (Vite)**
- **Tailwind CSS v4**
- **React Router**
- **Context API**
- **useState**
- **useReducer**
- **useEffect**
- **Browser localStorage**

---

## React Concepts Used

- Functional Components
- JSX
- Props
- Controlled Components
- useState
- useReducer
- useEffect
- Context API
- React Router
- Conditional Rendering
- Lists with `map()`
- Filtering with `filter()`
- Immutable state updates
- Object and array spreading
- Local persistence using `localStorage`

---

## Data Persistence

Each tracker has its own Context Provider.

State is managed using `useReducer` and automatically synchronized with the browser using `useEffect` and `localStorage`.

```
User Action
      ↓
dispatch()
      ↓
Reducer updates state
      ↓
React re-renders
      ↓
useEffect runs
      ↓
localStorage updated
```

When the application starts, previously saved data is loaded back into React automatically.

---

## Project Structure

```text
src/
│
├── components/
│   ├── EditCompanyForm.jsx
│   ├── EditDSAForm.jsx
│   ├── EditInterviewForm.jsx
│   ├── EditProjectForm.jsx
│   ├── ModuleHeader.jsx
│   ├── Navbar.jsx
│   └── PriorityBadge.jsx
│
├── context/
│   ├── CompanyContext.jsx
│   ├── DSAContext.jsx
│   ├── InterviewContext.jsx
│   └── ProjectContext.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── CompanyTracker.jsx
│   ├── DSATracker.jsx
│   ├── InterviewJournal.jsx
│   └── ProjectTracker.jsx
│
├── utils/
│   ├── dashboardUtils.js
│   └── dateUtils.js
│
├── App.jsx
└── main.jsx
```

---

## Getting Started

```bash
git clone https://github.com/jaindhruv04/careeros.git

cd careeros

npm install

npm run dev
```

---

## Deployment

The application is deployed using **GitHub Pages**.

Routing is configured using:

- `base: "/careeros/"` inside `vite.config.js`
- `basename="/careeros"` inside `BrowserRouter`
- `404.html` redirect support for page refreshes

---

## Future Improvements

- Form validation (React Hook Form + Zod)
- Backend with Node.js + Express
- MongoDB integration
- User authentication (JWT)
- Cloud deployment
- Responsive mobile improvements
- Analytics dashboard
- Export/import data

---

## Author

**Dhruv Jain**

B.Tech Information Technology  
BPIT (GGSIPU Delhi)

Built as a practical React learning project while preparing for software engineering placements.