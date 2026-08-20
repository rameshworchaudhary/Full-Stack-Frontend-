# Student Dashboard

A clean, modern student portal frontend connected to a Spring Boot REST API for managing academic schedules, timetable sessions, and campus announcements.

## Features

- **Student Authentication**: Secure login and registration flows powered by Spring Boot and BCrypt password encryption.
- **Academic Dashboard**: Overview of scheduled study sessions, active announcements, backend connectivity status, and quick action shortcuts.
- **Study Schedule Management**: Create, edit, search, and delete study sessions, exams, and project milestones with full date/time formatting.
- **Announcements & Notices**: Read, publish, edit, search, and delete campus and departmental announcements.
- **Course & Assignment Modules**: Clean institutional views for curriculum synchronization and assignment deadlines.
- **Student Profile**: Overview of authenticated credentials, active session status, and sign-out controls.
- **Human-Crafted Minimalist UI**: High-contrast white theme (`#FFFFFF`) with dark typography (`#111111`), subtle borders (`#E5E5E5`), and responsive mobile drawer navigation.

## Tech Stack

- **Frontend**: React 19, Vite, Lucide React, Custom CSS3 Design System
- **Backend**: Java / Spring Boot REST API
- **Database**: H2 Database (with persistent entity schemas)
- **Deployment**: Render (Backend), Vercel / Cloud Run (Frontend)

## Architecture

```text
Frontend (React 19 + Vite SPA)
      ↓ HTTP / JSON (CORS-enabled)
Spring Boot REST API (Deployed on Render)
      ↓ JPA / Hibernate
H2 Database
```

- **Backend Base URL**: `https://full-stack-0yf4.onrender.com`

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new student account (`name`, `email`, `password`)
- `POST /api/auth/login` — Authenticate student credentials (`email`, `password`)

### Announcements (Posts)
- `GET /api/posts` — Retrieve all announcements
- `GET /api/posts/{id}` — Retrieve an announcement by ID
- `POST /api/posts` — Create a new announcement (`title`, `content`)
- `PUT /api/posts/{id}` — Update an existing announcement (`title`, `content`)
- `DELETE /api/posts/{id}` — Delete an announcement

### Study Schedules
- `GET /api/schedules` — Retrieve all study schedules
- `GET /api/schedules/{id}` — Retrieve a schedule by ID
- `POST /api/schedules` — Create a new schedule session (`title`, `scheduledAt`)
- `PUT /api/schedules/{id}` — Update an existing schedule session (`title`, `scheduledAt`)
- `DELETE /api/schedules/{id}` — Delete a schedule session

## Local Development

Ensure Node.js 18+ is installed on your local machine.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file (or copy from `.env.example`):
```bash
VITE_API_BASE_URL=https://full-stack-0yf4.onrender.com
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```

### 5. Run Linter
```bash
npm run lint
```

## Backend

The frontend communicates with the live, deployed Spring Boot REST API hosted on Render:
- Production Backend: `https://full-stack-0yf4.onrender.com`

The backend provides CORS headers, JSON request/response validation, and entity persistence.

## Database

The backend uses an H2 database instance for data storage, managing users, posts, and schedules.

## Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the Spring Boot REST API | `https://full-stack-0yf4.onrender.com` |

## Deployment

- **Frontend**: Deployable as a static SPA on Vercel, Netlify, or Cloud Run.
- **Backend**: Hosted on Render as a Spring Boot application container.

## Project Structure

```text
├── .env.example          # Environment variables template
├── index.html            # Main HTML document
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── src/
│   ├── api/
│   │   └── api.js        # REST API client & endpoint definitions
│   ├── components/
│   │   ├── AnnouncementsView.jsx # Announcements list, editor & search
│   │   ├── AssignmentsView.jsx   # Coursework & assignment notices
│   │   ├── AuthView.jsx          # Login & registration forms
│   │   ├── CoursesView.jsx       # Course syllabus & curriculum view
│   │   ├── DashboardView.jsx     # Overview metrics, upcoming schedules & announcements
│   │   ├── Header.jsx            # Top navigation header & status badge
│   │   ├── ProfileView.jsx       # Student profile & credentials
│   │   ├── ScheduleView.jsx      # Study schedule management & date pickers
│   │   └── Sidebar.jsx           # Responsive desktop/mobile sidebar
│   ├── App.css           # Minimalist white theme styling
│   ├── App.jsx           # Main application router and state container
│   ├── index.css         # Global resets & font configurations
│   └── main.jsx          # React DOM entry point
└── README.md             # Project documentation
```

## Future Improvements

- Integration with university LMS systems for automated course syllabus and grade syncing.
- Push notification reminders for scheduled exam dates and study milestones.
- Export schedule to standard `.ics` / iCal calendar files.
