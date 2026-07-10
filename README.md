# Skill Swap Platform

This is the foundational project architecture for the Skill Swap Platform. It is a full-stack web application built using modern web development tools, fully containerized and optimized for hackathon team collaboration.

## Technologies Used

**Frontend:** React 18, Vite, Tailwind CSS, React Router DOM, Axios
**Backend:** Node.js, Express.js, PostgreSQL, Prisma ORM, JWT, Winston
**DevOps:** Docker, Docker Compose, GitHub Actions

## Project Structure

```
skillswap/
├── .github/                # GitHub Actions CI and Issue/PR templates
├── backend/
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/                # Backend source code (controllers, routes, middlewares)
│   ├── .env.example        # Environment variable templates
│   ├── Dockerfile          # Backend Docker configuration
│   └── package.json        # Backend dependencies
├── docs/                   # Centralized project documentation
│   ├── api-contract.md
│   ├── database.md
│   ├── project-architecture.md
│   └── workflow.md
├── frontend/
│   ├── src/                # Frontend source code (React components, pages, styling)
│   ├── .env.example        # Frontend environment templates
│   ├── Dockerfile          # Frontend Docker configuration
│   └── package.json        # Frontend dependencies
├── .editorconfig           # Editor configuration
├── .gitignore              # Root gitignore
├── CONTRIBUTING.md         # Collaboration standards and Git flow
├── docker-compose.yml      # Orchestrates full stack local environment
└── README.md
```

## Getting Started

The easiest way to start developing is using Docker Compose. This ensures everyone on the team has the exact same environment, including the PostgreSQL database.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed.
- Git

### 1. Environment Setup
1. Clone the repository and navigate into it.
2. In the `backend/` directory, copy `.env.example` to `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. In the `frontend/` directory, copy `.env.example` to `.env`:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

### 2. Start the Stack (One Command)
Run the following command in the root of the project to build and start the entire stack (Frontend, Backend, and PostgreSQL database):

```bash
docker compose up --build
```
*Note: Hot-reloading is enabled via volume mounts. Any changes you make to `frontend/src` or `backend/src` will automatically reflect in the running containers without restarting.*

### 3. Accessing the Application
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## Collaboration & Documentation
- Please read [CONTRIBUTING.md](CONTRIBUTING.md) to understand our Git branching strategy and pull request process.
- Detailed architecture, database, and API documentation can be found in the [`docs/`](docs/) directory.
