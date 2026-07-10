# Database Documentation

We are using **PostgreSQL** alongside the **Prisma ORM** for the Skill Swap Platform.

## Configuration
The database connection string is configured via the `DATABASE_URL` in your backend `.env` file.
When running via Docker Compose, the connection string is automatically set for the backend container.

## Prisma Workflow
- **Define Models**: Define your data models in `backend/prisma/schema.prisma`.
- **Generate Client**: Run `npx prisma generate` to generate the Prisma Client, which provides auto-completion and types.
- **Sync Schema**: Run `npx prisma db push` during development to synchronize your schema with the database without creating a formal migration file.
- **Formal Migrations**: When ready for production-level schema changes, use `npx prisma migrate dev`.

## Interacting with the Database
In your backend services, import the Prisma client instance to interact with the database.

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example usage
const users = await prisma.user.findMany();
```
