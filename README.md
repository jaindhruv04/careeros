# CareerOS

A unified placement-preparation dashboard built with React. CareerOS helps students track DSA practice, company applications, interview notes, personal projects, daily goals, and AI-assisted placement workflows in one place.

**Live frontend:** https://careeros-dwui.onrender.com

**Backend API:** https://careeros-api-0zqj.onrender.com

---

## Overview

Students preparing for placements often use separate tools for DSA tracking, company applications, interview notes, project planning, and daily goals. CareerOS brings these workflows into one focused dashboard.

The Dashboard aggregates live data from the trackers, including high-priority items, progress rates, recent activity, and quick insights.

CareerOS also includes an AI assistant powered by Groq that can interact with authenticated CareerOS data through controlled backend tools.

The project is being built incrementally while learning full-stack development, with each feature implemented after understanding the underlying concept.

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

- Track DSA problems
- Store difficulty, topic, status, priority, revision flag, and notes
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

### CareerOS AI

CareerOS AI is a backend-integrated AI assistant that can interact with the user's CareerOS data through controlled tool calls.

Current AI capabilities include:

- Read active company/application records
- Read active DSA problems
- Add new DSA problems
- Delete DSA problems
- Perform multiple tool calls during a single request
- Return database-backed results instead of relying on model memory

The AI does not receive direct database credentials or direct database access.

Instead, the flow is:

```text
User
  ↓
CareerOS AI
  ↓
Groq tool call
  ↓
Backend tool function
  ↓
Authenticated req.userId
  ↓
Prisma
  ↓
PostgreSQL
  ↓
Tool result
  ↓
Groq
  ↓
Final response
```

This keeps database operations inside the backend and scopes database access to the authenticated user.

### Current AI Tools

```text
get_my_companies
get_my_dsa_problems
create_dsa_problem
delete_dsa_problem
```

The AI uses Groq function/tool calling with `tool_choice: "auto"` so the model can decide when a CareerOS operation is required.

The backend supports multiple tool-call rounds with a maximum iteration limit, allowing multi-step interactions instead of assuming every request can be completed in a single tool call.

---

## Data Persistence

### Backend-integrated trackers

Company and DSA data is stored in PostgreSQL through the Express backend and Prisma ORM.

```text
User action / AI action
        ↓
REST API or AI tool
        ↓
JWT authentication
        ↓
Authenticated user ID
        ↓
Prisma
        ↓
PostgreSQL
```

### Client-only trackers

Interview and Project data currently uses browser `localStorage`.

```text
User action
    ↓
dispatch()
    ↓
Reducer updates state
    ↓
React re-renders
    ↓
useEffect
    ↓
localStorage
```

Daily goals are currently session-based and reset after refresh.

---

## AI Tool Architecture

CareerOS uses application-side tool calling rather than giving the language model direct access to the database.

Each tool has two parts:

### Tool Definition

The available function and its parameters are described to Groq.

### Tool Implementation

The backend executes the requested operation using application code and Prisma.

For example:

```text
create_dsa_problem
        ↓
createDsaProblem(userId, data)
        ↓
prisma.dSAProblem.create(...)
```

The authenticated user ID comes from the backend authentication middleware rather than from model-generated arguments.

This prevents the AI from selecting another user's database records.

The AI tool workflow follows this pattern:

```text
Model requests tool
        ↓
Backend executes tool
        ↓
Tool result returned to model
        ↓
Model generates final response
```

For multi-step requests, the backend can repeat this process for multiple tool-call rounds.

---

## Authentication and Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected backend routes
- User-specific database queries
- AI tools receive the authenticated `req.userId`
- Groq API key remains on the backend
- AI does not receive database credentials
- Database operations are executed by backend application code
- AI-generated database operations are scoped to the authenticated user

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS v4
- React Router
- Context API
- Browser `localStorage`

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- CORS
- dotenv

### AI

- Groq API
- Groq SDK
- Function / tool calling
- `openai/gpt-oss-20b`

### Deployment

- Render
- Supabase PostgreSQL

---

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

---

## Data Flow and Persistence

### Backend-integrated Trackers

Company and DSA data use the following flow:

```text
User action
    ↓
React component
    ↓
API request with JWT
    ↓
Express route
    ↓
Authentication middleware
    ↓
Controller
    ↓
Prisma
    ↓
PostgreSQL
    ↓
API response
    ↓
React state
    ↓
UI update
```

### AI-powered Data Operations

```text
User message
    ↓
AIChat component
    ↓
POST /ai/chat
    ↓
JWT authentication
    ↓
Groq
    ↓
Tool selection
    ↓
Backend AI tool
    ↓
Prisma
    ↓
PostgreSQL
    ↓
Tool result
    ↓
Groq
    ↓
Final response
```

---

## Project Structure

```text
src/
│
├── components/
│   ├── AIChat.jsx
│   └── ...
├── context/
├── pages/
├── utils/
├── App.jsx
└── main.jsx

server/
├── controllers/
│   ├── aiController.js
│   ├── aiToolsController.js
│   ├── companyController.js
│   └── ...
├── middleware/
├── prisma/
├── routes/
└── app.js
```

---

## Getting Started

### Frontend

```bash
git clone https://github.com/jaindhruv04/careeros.git
cd careeros
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
nodemon app.js
```

The frontend API URL is configured through the `VITE_API_URL` environment variable.

The backend frontend origin is configured through `CLIENT_ORIGIN`.

The backend also requires:

```text
DATABASE_URL
JWT_SECRET
GROQ_API_KEY
```

---

## AI Request Flow

A normal CareerOS AI request follows this flow:

```text
User message
      ↓
POST /ai/chat
      ↓
JWT authentication
      ↓
Groq Chat Completion
      ↓
Model decides whether a tool is required
      ↓
Tool call returned
      ↓
Backend executes tool
      ↓
Tool result added to conversation
      ↓
Groq receives tool result
      ↓
Final AI response
```

For more complex requests, the backend can continue the tool-calling cycle for multiple rounds until the model produces a final answer or reaches the configured maximum number of tool rounds.

---

## Current AI Capabilities

### Read

- Read active company/application records
- Read active DSA problems

### Create

Add DSA problems through natural-language requests.

Example:

```text
Add Two Sum to my DSA tracker.
Topic Array, difficulty Easy, status Solved, priority High.
```

### Delete

Delete DSA problems through natural-language requests.

Example:

```text
Delete Two Sum from my DSA tracker.
```

### Multi-step Tool Execution

The AI backend supports multiple tool-call rounds, allowing the model to retrieve CareerOS data and then perform additional operations based on the retrieved information.

A maximum tool-round limit is used to prevent uncontrolled tool execution.

---

## Current AI Tools

| Tool | Purpose |
|---|---|
| `get_my_companies` | Read active company/application records |
| `get_my_dsa_problems` | Read active DSA problems |
| `create_dsa_problem` | Create a DSA problem |
| `delete_dsa_problem` | Delete a DSA problem |

---

## Deployment

CareerOS is deployed using Render.

- Frontend: https://careeros-dwui.onrender.com
- Backend API: https://careeros-api-0zqj.onrender.com

The frontend uses the root Vite base path (`/`) and standard `BrowserRouter` routing.

The PostgreSQL database is hosted using Supabase.

---

## Current AI Roadmap

### Completed

- AI chat interface
- Groq integration
- Authenticated AI requests
- Company data read tool
- DSA data read tool
- DSA creation tool
- DSA deletion tool
- Multi-round tool execution
- User-scoped database operations

### Planned

- Update DSA problems through AI
- Create company applications through AI
- Update company applications through AI
- Delete companies through AI
- Confirmation system for destructive operations
- Safer bulk operations
- CareerOS statistics tool
- AI-generated placement insights
- Interview and project data integration
- Persistent daily goals
- Analytics dashboard
- Export and import data

---

## Known Limitations

- Interview and Project trackers are still client-side
- Daily goals are session-based
- AI-triggered database changes do not currently synchronize the visible React tracker state until the page data is refreshed
- Destructive AI operations need a confirmation layer before production use
- AI tool coverage currently focuses on Companies and DSA

---

## Future Improvements

- Migrate Interview and Project trackers to the backend
- Persistent daily goals
- AI-powered placement analytics
- AI-generated DSA progress reports
- Application follow-up recommendations
- Interview preparation insights
- Responsive mobile improvements
- Export and import data
- Analytics dashboard
- Improved frontend synchronization after AI-triggered mutations

---

## Author

**Dhruv Jain**

B.Tech Information Technology  
BPIT, GGSIPU Delhi

Built as a practical full-stack learning project while preparing for software engineering placements.
