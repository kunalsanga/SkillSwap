# Project Architecture Overview

## The Stack
The Skill Swap Platform is built on a modern JavaScript full-stack architecture:
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL accessed via Prisma ORM.
- **Infrastructure**: Docker & Docker Compose for unified local development environments.

## Directory Structure
- `/frontend`: Contains all client-side code, configurations, and Vite setup.
- `/backend`: Contains the RESTful API server, database models, and business logic.
- `/docs`: Contains foundational project documentation.
- `.github`: Contains CI/CD pipelines and repository templates.

## Communication Flow
1. **Client** (React app) makes an HTTP request via Axios to the backend.
2. **Backend Server** (Express on port 5000) intercepts the request.
3. Middlewares (CORS, Helmet, Morgan, Auth) process the request before it reaches the controller.
4. The **Controller** interacts with **Services** to execute business logic.
5. **Services** use the Prisma client to interact with the **PostgreSQL** database.
6. A standardized `ApiResponse` is sent back to the client.

## Environment Variables
- `PORT`: Backend server port (default 5000)
- `NODE_ENV`: Application environment (development/production)
- `DATABASE_URL`: Full connection string to PostgreSQL
- `JWT_SECRET`: Secret key for signing JSON Web Tokens
