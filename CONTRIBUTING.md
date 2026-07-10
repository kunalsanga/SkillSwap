# Contributing to Skill Swap Platform

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:
- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## Git Branching Strategy
We follow a standard Git Flow:
- `main`: Production-ready code. Do not push directly to this branch.
- `develop`: Integration branch for features. Base your branches off of here.
- `feature/*`: New features (e.g., `feature/user-profile`).
- `bugfix/*`: Bug fixes (e.g., `bugfix/login-error`).
- `hotfix/*`: Urgent fixes for production (e.g., `hotfix/database-crash`).

## Conventional Commits
Please format your commit messages according to the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries

**Example:** `feat: add JWT authentication middleware`

## Pull Request Process
1. Ensure your code is thoroughly tested and passes linting (`npm run lint`).
2. Update the README.md with details of changes to the interface, if applicable.
3. Your PR must be reviewed and approved by at least one other team member.
4. Merge using "Squash and merge" to keep the history clean.

## Code Review Checklist
Before submitting your PR, review this checklist:
- [ ] Code follows the style guide (`.editorconfig`, ESLint, Prettier).
- [ ] No hardcoded secrets (use `.env`).
- [ ] Logging is properly utilized (`utils/logger.js`).
- [ ] Error handling is robust (`middlewares/error.middleware.js`).

Thank you for contributing!
