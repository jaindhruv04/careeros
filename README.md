# CareerOS

CareerOS is a full-stack placement-preparation workspace for students. It brings DSA practice tracking, job applications, project planning, interview notes, progress insights and an AI assistant into one dashboard.

- **Live app:** https://careeros-dwui.onrender.com
- **Backend API:** https://careeros-api-0zqj.onrender.com
- **Repository:** https://github.com/jaindhruv04/careeros

## Features

### Dashboard
- Overview of company applications, DSA problems, interviews and projects.
- High-priority items, progress summaries, recent activity and quick insights.
- Daily goals checklist (component state only; resets on refresh).

### DSA tracker
- Create, view, edit, archive, restore and delete problems.
- Track topic, difficulty, status, priority, revision flag and notes.
- Search and filter problems.
- Persist data in PostgreSQL through the authenticated API.

### Company application tracker
- Create, view, edit, archive, restore and delete applications.
- Track company, role, application status, application date, priority and notes.
- Search and filter applications.
- Persist data in PostgreSQL through the authenticated API.

### Project tracker
- Create, view, edit, archive, restore and delete projects.
- Track project name, technology stack, progress, status, priority and notes.
- Search and filter projects.
- Persist data in PostgreSQL through the authenticated API.

### Interview journal
- Record company, interview round, questions, answers, mistakes, lessons learned, priority and notes.
- Edit, archive, restore and delete entries.
- Search and filter entries.
- Persist data in PostgreSQL through the authenticated API.

### Analytics
Backend analytics currently use the authenticated user's **non-archived DSA problems and company applications**.

DSA metrics include totals by status and difficulty, solve rates, topic performance, revision count, and created-date-based 7/30-day solved counts.

Company metrics include application status and priority distributions, interview/offer conversion calculations, and applications created in the last 30 days.

The endpoint also returns rule-based insights and recommendations. Project and interview records are not currently included in these backend analytics.

### CareerOS AI
CareerOS AI is a Groq-powered assistant available in the authenticated dashboard. It can use backend tools to:

- Read the current user's active company applications.
- Read the current user's active DSA problems.
- Create a DSA problem.
- Delete a DSA problem.

Current tool names:

```text
get_my_companies
get_my_dsa_problems
create_dsa_problem
delete_dsa_problem
```

Tool operations execute on the backend through Prisma. The authenticated user ID comes from verified JWT middleware, not model-generated input. The assistant supports up to five tool-call rounds per request.

The chat endpoint currently receives the latest message only. Conversation history is not persisted or sent as context across requests. AI-created or deleted DSA records may require the tracker data to be refreshed before the change appears in the list.

## Tech stack

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | Tailwind CSS 4 |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (Supabase-hosted in deployment) |
| ORM | Prisma 7 with PostgreSQL adapter |
| Authentication | JWT, bcrypt |
| AI | Groq SDK with tool calling |
| Frontend state | React Context and React hooks |
| Deployment | Render |

## Architecture

The frontend communicates with the Express API using `apiFetch`. Protected requests include a Bearer JWT. The backend verifies the token, attaches the authenticated user ID to `req.userId`, and scopes user-owned database operations to that ID.

```text
React pages and Context providers
            |
            v
     apiFetch + Bearer JWT
            |
            v
       Express routes
            |
            v
   JWT authentication middleware
            |
            v
        Controllers
            |
            v
       Prisma ORM
            |
            v
       PostgreSQL
            |
            v
     JSON response -> UI
```

CareerOS AI follows a backend tool-execution flow:

```text
Authenticated message
        |
        v
     POST /ai/chat
        |
        v
 JWT middleware -> req.userId
        |
        v
    Groq completion
        |
        v
    Tool call request
        |
        v
Backend tool implementation
        |
        v
Prisma query scoped to req.userId
        |
        v
   Tool result -> Groq
        |
        v
   Assistant response
```

## Authentication and data ownership

- Registration hashes passwords with bcrypt before storing them.
- Login verifies the password and issues a JWT that expires after seven days.
- The frontend stores the JWT in browser `localStorage`.
- Authenticated API requests send `Authorization: Bearer <token>`.
- Backend middleware verifies the token and sets `req.userId`.
- DSA, company, project and interview records are associated with their owning user.
- Protected resource operations are scoped to the authenticated user.

The logout endpoint returns a confirmation response; the current JWT implementation is stateless and does not maintain a server-side token revocation list.

## API routes

All resource routes below require a valid Bearer JWT unless marked Public.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/users/register` | Register a user | Public |
| POST | `/users/login` | Log in and receive a JWT | Public |
| POST | `/users/logout` | Return logout confirmation | Public |
| GET | `/users/me` | Get the authenticated user's profile | Protected |
| GET | `/dsa` | List DSA problems | Protected |
| POST | `/dsa` | Create a DSA problem | Protected |
| GET | `/dsa/:id` | Get one DSA problem | Protected |
| PATCH | `/dsa/:id` | Update a DSA problem | Protected |
| DELETE | `/dsa/:id` | Delete a DSA problem | Protected |
| GET | `/companies` | List company applications | Protected |
| POST | `/companies` | Create a company application | Protected |
| GET | `/companies/:id` | Get one application | Protected |
| PATCH | `/companies/:id` | Update an application | Protected |
| DELETE | `/companies/:id` | Delete an application | Protected |
| GET | `/projects` | List projects | Protected |
| POST | `/projects` | Create a project | Protected |
| GET | `/projects/:id` | Get one project | Protected |
| PATCH | `/projects/:id` | Update a project | Protected |
| DELETE | `/projects/:id` | Delete a project | Protected |
| GET | `/interviews` | List interview entries | Protected |
| POST | `/interviews` | Create an interview entry | Protected |
| GET | `/interviews/:id` | Get one interview entry | Protected |
| PATCH | `/interviews/:id` | Update an interview entry | Protected |
| DELETE | `/interviews/:id` | Delete an interview entry | Protected |
| GET | `/analytics` | Get DSA and company analytics | Protected |
| POST | `/ai/chat` | Send a message to CareerOS AI | Protected |

## Database models

The Prisma schema defines five PostgreSQL models:

- **User:** email, optional name, password hash, creation timestamp and relations to all user-owned records.
- **DSAProblem:** problem name, topic, difficulty, status, priority, revision flag, notes, archive flag, timestamps and owner.
- **Company:** company name, role, status, application date, priority, notes, archive flag, timestamps and owner.
- **Project:** name, technology stack, progress, status, priority, notes, archive flag, timestamps and owner.
- **InterviewEntry:** company, round, questions, answer, mistakes, lessons learned, priority, notes, archive flag, timestamps and owner.

Deleting a user cascades to their related records.

## Project structure

```text
careeros/
├── src/
│   ├── components/       # Shared UI and feature components
│   ├── context/          # Company, DSA, project and interview state
│   ├── pages/            # Dashboard, trackers, analytics and auth pages
│   ├── utils/            # API and dashboard/date utilities
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── controllers/      # Auth, CRUD, analytics and AI logic
│   ├── lib/              # Prisma client setup
│   ├── middleware/       # JWT authentication
│   ├── prisma/           # Schema and migrations
│   ├── routes/           # Express route definitions
│   ├── tests/            # Backend API integration tests
│   ├── app.js
│   └── prisma.config.ts
├── .github/workflows/    # Backend integration-test workflow
├── package.json
└── vite.config.js
```

## Run locally

### Prerequisites

- Node.js and npm
- PostgreSQL database
- Groq API key (for CareerOS AI)

### 1. Clone the repository

```bash
git clone https://github.com/jaindhruv04/careeros.git
cd careeros
```

### 2. Configure the backend

Create `server/.env`:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
CLIENT_ORIGIN=http://localhost:5173
PORT=3000
```

`GROQ_MODEL` is optional; the backend defaults to `openai/gpt-oss-20b`.

Install dependencies, generate the Prisma client and apply migrations:

```bash
cd server
npm install
npx prisma generate
npx prisma migrate deploy
node app.js
```

For a brand-new local database with no migrations applied, use the appropriate Prisma migration creation workflow for your development environment before starting the API.

### 3. Configure the frontend

Create a root `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

In a second terminal, from the repository root:

```bash
npm install
npm run dev
```

Vite prints the local frontend URL, normally `http://localhost:5173`.

## Scripts

Run frontend scripts from the repository root:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |
| `npm run deploy` | Build and publish `dist` using gh-pages |

Run backend commands from `server/`:

| Command | Purpose |
|---|---|
| `node app.js` | Start the Express API |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate deploy` | Apply pending migrations to the configured database |
| `npm test` | Run backend integration tests |

## Testing and database safety

The backend integration tests use Node.js's built-in test runner and a PostgreSQL database. They start the Express API and exercise registration, login, protected routes, DSA/company/project/interview CRUD, user-level access isolation and analytics.

**The test setup truncates the `DSAProblem`, `Company`, `Project`, `InterviewEntry` and `User` tables before running.** Before running `npm test`, verify that the effective `DATABASE_URL` points to a dedicated, disposable test database. Never run the suite against production, live Supabase or a shared database.

GitHub Actions runs the backend integration suite against a dedicated PostgreSQL 16 service.

## Current limitations

- Daily goals exist only in Dashboard component state and reset when the page is refreshed.
- Backend analytics cover DSA problems and company applications, not project or interview records.
- The DSA 7-day and 30-day solved counts filter by record creation date and current Solved status; they do not track the date a problem changed to Solved.
- AI currently reads company and DSA records and can create or delete DSA problems. It does not manage project, interview or company records.
- AI chat history is not persisted or sent between requests.
- AI-created or deleted DSA records may not appear in the tracker until its data is refreshed.
- The backend integration tests do not exercise the live Groq provider or browser UI flows.

## Author

**Dhruv Jain**  
B.Tech Information Technology, BPIT

[GitHub: @jaindhruv04](https://github.com/jaindhruv04)

---

Built with React, Express, PostgreSQL, Prisma and Groq.
