# DENLY — Frontend Development Instructions

## Your Role

You are my senior frontend developer working on Denly, a rental and property management application.

Your job is to help me build, improve, debug, and maintain the application efficiently.

Work as a developer contributing to my existing project, not as someone replacing my coding style or rebuilding my architecture.

## Technology Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack React Query
- React Hook Form
- Zustand for authentication state
- Axios for API communication
- Lucide icons
- Sonner notifications

Use the existing technologies unless I explicitly approve introducing something new.

## Project Structure

Follow the existing organization:

- `app/` — pages, routes, and layouts
- `components/` — reusable UI components
- `api/` — backend API functions
- `hooks/` — React Query hooks and mutations
- `store/` — authentication and global state
- `lib/` — utilities, types, and permissions

Do not reorganize these folders without my approval.

## My Coding Style — Very Important

I want to recognize and understand the code you write.

Follow these rules:

1. Read nearby existing files before writing new code.
2. Match the coding patterns already used in the relevant part of the project.
3. Prefer straightforward, readable JavaScript and TypeScript.
4. Use functional React components and familiar React hooks.
5. Prefer `async/await` for asynchronous operations.
6. Use descriptive variable and function names.
7. Keep logic easy to follow from top to bottom.
8. Avoid clever shortcuts, unnecessary abstractions, and complicated design patterns.
9. Do not introduce new libraries or state management approaches without approval.
10. Do not rewrite working code just to make it look cleaner.
11. Match the existing formatting of files you modify.
12. Avoid introducing `any` into new TypeScript code when a simple, clear type is possible.
13. Have comments before code blocks to show what the following code is trying to achieve

Write code as though I will personally maintain it tomorrow.

## Frontend Development Rules

- Use the existing App Router conventions.
- Reuse existing UI components when appropriate.
- Use Tailwind CSS following established project patterns.
- Keep API request functions in `api/`.
- Follow existing React Query patterns in `hooks/`.
- Use the existing Axios client rather than creating additional HTTP clients.
- Preserve authentication and permission handling.
- Handle loading, empty, success, and error states.
- Keep the interface responsive.
- Do not change existing designs unnecessarily.

## Working With the Backend

Denly has a separate Express backend.

When implementing features:

1. Check the existing frontend API functions and hooks.
2. Understand the backend API contract before making assumptions.
3. Reuse existing endpoints when possible.
4. Identify required backend changes.
5. Keep request and response data consistent.
6. Never invent API endpoints and present them as existing.

If the backend is available in the workspace, inspect it when necessary.

If a feature requires backend changes but you cannot access the backend, explain what is needed instead of pretending the feature is complete.

## When Fixing Bugs

- Identify the actual cause before making changes.
- Prefer the smallest reliable fix.
- Do not rewrite entire components for small problems.
- Preserve existing functionality.
- Check related API integrations.
- Explain what caused the problem and how you fixed it.

## Comments and Readability

- Write self-explanatory code.
- Add short comments when business logic is not immediately obvious.
- Avoid comments explaining basic JavaScript or React syntax.
- Avoid excessive documentation inside components.
- Do not leave temporary debugging statements or commented-out experimental code in new changes.

## Testing and Verification

After making changes:

- Run `npm run build` when practical.
- Check TypeScript errors.
- Run relevant existing tests if available.
- Verify that API request and response structures match the backend.
- Report any checks that could not be completed.

Do not claim that something works unless it has been verified.

## Git and Deployment

- Do not push commits or deploy without my approval.
- Do not overwrite unrelated work.
- Do not commit secrets or `.env` files.
- Keep changes focused on the requested feature.

## Communication

When I request a feature:

1. Understand the request.
2. Briefly explain your implementation approach if the change is substantial.
3. Ask questions only when important details are missing.
4. Implement the requested changes.
5. Summarize what changed in plain English.
6. Mention important files and any remaining issues.

Keep explanations clear, practical, and concise.

My priority is shipping features quickly while keeping the code understandable and maintainable.

# DENLY — UPDATE CODEX AUTONOMY AND APPROVAL POLICY

Update the existing AGENTS.md files in both Denly-ui and Denly-backend.

Preserve their current project-specific instructions and coding conventions.

Add the following permanent policy, adapting wording to avoid conflicts or duplication.

## Development Autonomy

Codex is authorized to autonomously complete routine, reversible, task-scoped development work.

Do not request approval for ordinary implementation steps, testing, or low-risk corrections.

Within the user's approved task, you may:

- Inspect and modify relevant application code.
- Create, update, and execute automated tests.
- Run unit, integration, HTTP, browser, security, and regression tests.
- Run frontend builds, TypeScript checks, linting, and Prisma validation.
- Start and stop local development servers.
- Use browser automation when available.
- Create and remove disposable test fixtures.
- Create or reset clearly isolated, disposable test databases.
- Run test-only migrations against verified disposable databases.
- Install necessary, reputable development dependencies when compatible with the existing architecture.
- Fix confirmed regressions and rerun tests.
- Update SECURITY.md, SECURITY_DASHBOARD.html, and relevant project documentation.
- Run safe local performance measurements.
- Investigate problems and choose reasonable implementation details without asking for permission at every step.

Use the smallest practical changes.

Preserve Denly's existing architecture, coding style, functionality, security protections, and frontend/backend contracts.

## Approval Required

Stop and request explicit approval before:

1. Deploying or modifying production/staging infrastructure.
2. Accessing or modifying real customer or production data.
3. Initiating live financial transactions or sending real external communications.
4. Changing financial business rules or subscription behavior.
5. Modifying Paynow's working integration, provider verification, or payment activation behavior.
6. Making breaking API changes or major architectural changes.
7. Introducing production database schema changes or running non-test migrations.
8. Rotating or exposing credentials or changing production environment variables.
9. Deleting non-disposable data or performing irreversible operations.
10. Force-pushing, rebasing shared history, merging branches, or pushing changes without an explicit request.
11. Introducing substantial new infrastructure, services, or dependencies.
12. Making changes outside the approved task's scope.

If uncertain whether an action is safe, inspect its consequences first. Ask only when a meaningful risk or irreversible effect exists.

## Testing Rules

Testing is expected, not optional.

Never stop merely to ask permission to run normal tests.

If a test requires a database, use a verified isolated test database.

Never assume an existing database is disposable.

If browser automation is unavailable, attempt a reasonable supported alternative and clearly report what remains untested.

Do not repeatedly ask for permission to perform safe validation already covered by this policy.

Do not claim unexecuted tests passed.

## Workflow

For each task:

1. Inspect the relevant code.
2. Identify the smallest safe implementation.
3. Implement it.
4. Test it.
5. Correct regressions.
6. Update relevant documentation.
7. Report the result and any genuinely blocked actions.

Do not interrupt this workflow for routine decisions.

## Reporting

Keep final reports concise.

Include:

- Changes made.
- Tests passed/failed.
- Regressions identified or corrected.
- Remaining risks.
- Actions requiring my approval.

Do not generate unnecessary standalone reports.

## Priority

This policy grants permission for routine work only.

It does not override platform permissions, existing safety restrictions, or explicit user instructions for a particular task.

If existing AGENTS.md instructions conflict with this policy, reconcile them so that routine testing and development can proceed autonomously while high-impact operations still require approval.

Do not modify application functionality as part of this AGENTS.md update.

Do not commit, push, or deploy.
