# Skill Swap Platform

The Skill Swap Platform is a modern, full-stack web application built to connect professionals, developers, and designers who want to exchange their skills. Users can list the skills they offer and the skills they want to learn, discover matches, and facilitate skill-swapping sessions. 

This project was built during the Odoo Hackathon and is fully containerized and optimized for team collaboration.

## Features

- **User Authentication:** Secure JWT-based login and registration with strict Zod validation.
- **Skill Matching:** Users can define `OFFERED` and `WANTED` skills to find matching swap partners.
- **Swap Requests:** Send, accept, complete, or cancel skill swap requests.
- **Ratings & Feedback:** Users can rate each other after completing a swap.
- **Admin Dashboard:** Role-based access control allowing admins to moderate users (ban/unban), manage platform skills, and post announcements.
- **Responsive UI:** A beautiful, responsive interface built with Tailwind CSS and Lucide React icons.
- **Real-time Notifications:** Toast notifications for instant user feedback.

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JSON Web Tokens (JWT)
- Zod (Validation)
- Winston (Logging)

**DevOps & Tools:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- ESLint & Prettier

## Architecture

The application follows a standard monolithic client-server architecture:
- **Client Layer:** A React Single Page Application (SPA) providing the user interface and managing state via Context API.
- **API Layer:** An Express.js REST API providing secure endpoints, validation, and business logic.
- **Data Layer:** A PostgreSQL database managed via Prisma ORM for type-safe database queries and migrations.

## Folder Structure

```
skillswap/
├── .github/                # GitHub Actions CI and Issue/PR templates
├── backend/
│   ├── prisma/             # Prisma schema, migrations, and seed scripts
│   ├── src/                # Backend source code (controllers, routes, middlewares, services)
│   ├── .env.example        # Environment variable templates
│   ├── Dockerfile          # Backend Docker configuration
│   └── package.json        # Backend dependencies
├── docs/                   # Centralized project documentation
│   ├── api-contract.md
│   ├── database.md
│   ├── project-architecture.md
│   └── workflow.md
├── frontend/
│   ├── src/                # Frontend source code (React components, pages, styling, hooks)
│   ├── .env.example        # Frontend environment templates
│   ├── Dockerfile          # Frontend Docker configuration
│   └── package.json        # Frontend dependencies
├── .editorconfig           # Editor configuration
├── .gitignore              # Root gitignore
├── CONTRIBUTING.md         # Collaboration standards and Git flow
├── docker-compose.yml      # Orchestrates full stack local environment
└── README.md
```

## Installation & Docker Setup

The easiest way to start developing is using Docker Compose. This ensures everyone on the team has the exact same environment.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed.
- Git

### 1. Environment Variables
Clone the repository and navigate into it. Then, set up the environment variables:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

*Note: The `.env.example` files contain default values that work out-of-the-box for the Docker environment.*

### 2. Start the Stack (One Command)
Run the following command in the root of the project to build and start the entire stack (Frontend, Backend, and Database):

```bash
docker compose up --build
```
*Hot-reloading is enabled via volume mounts. Any changes you make to `frontend/src` or `backend/src` will automatically reflect in the running containers without restarting.*

### 3. Accessing the Application
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Database (PostgreSQL)**: `localhost:5432`

## API Endpoints

Here are the primary API endpoints available:

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - Get all users (supports `?skill=` filtering)
- `GET /api/users/:id` - Get user by ID

### Swaps
- `POST /api/swaps` - Create a new swap request
- `GET /api/swaps` - Get current user's swap requests
- `PATCH /api/swaps/:id/status` - Update swap status (Accept, Reject, Complete, Cancel)

### Ratings
- `POST /api/ratings` - Submit a rating for a completed swap

### Admin
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/ban` - Ban/Unban a user
- `DELETE /api/admin/skills/:id` - Remove a skill from the platform
- `POST /api/admin/announcements` - Create a global announcement

*(For a detailed API contract, see `docs/api-contract.md`)*

## Team Members
- [Kunal Sanga](https://github.com/kunalsanga) (Team Lead / Frontend / Backend)
- Team Member 2
- Team Member 3
- Team Member 4

---
**Happy Swapping!** 🚀
