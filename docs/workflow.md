# Hackathon Workflow & Collaboration Standards

To ensure a smooth hackathon experience for our 4-member team, please adhere to the following workflow.

## Issue Tracking & Branching
1. **Find or create an issue**: Use the provided issue templates for bugs or feature requests.
2. **Assign yourself**: Assign the issue to yourself on GitHub.
3. **Create a branch**: Branch off `develop`. Name it intuitively:
   - Features: `feature/<issue-number>-<short-description>`
   - Bug fixes: `bugfix/<issue-number>-<short-description>`
4. **Develop**: Write your code, ensuring you follow formatting guidelines.

## Commits & Pull Requests
- Use **Conventional Commits** (e.g., `feat: added user profile route`).
- Keep commits small and focused.
- Once ready, push your branch and open a Pull Request against `develop`.
- Use the PR template provided and link the relevant issue (e.g., `Fixes #42`).
- The CI pipeline will automatically run linting and build checks.
- Request a review from at least one other team member.

## Code Quality Standards
- Ensure ESLint and Prettier are integrated into your IDE (VS Code recommended).
- Run `npm run lint` and `npm run format` locally before committing.
- Do not bypass the GitHub Actions workflow checks.
