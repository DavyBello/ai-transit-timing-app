# Next.js AI Agent Development Guidelines

### 🔄 Project Awareness & Context
- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `TASK.md`** before starting a new task. If the task isn't listed, add it with a brief description and today's date.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in `PLANNING.md`.
- **Use npm or yarn** for package management and follow Next.js conventions for project structure.

### 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
  For Next.js apps this looks like:
    - `app/` - App Router pages and layouts (Next.js 13+)
    - `components/` - Reusable React components
    - `lib/` - Utility functions, API clients, and business logic
    - `types/` - TypeScript type definitions
    - `hooks/` - Custom React hooks
    - `utils/` - Helper functions and utilities
- **Use clear, consistent imports** (prefer absolute imports with path mapping configured in `tsconfig.json`).
- **Use environment variables** with `.env.local` for sensitive data and proper TypeScript typing.

### 🎨 Styling & UI Standards
- **Use Tailwind CSS** for all styling with consistent design patterns.
- **Follow mobile-first responsive design** principles.
- **Use semantic HTML** and ensure accessibility standards are met.
- **Implement consistent component patterns** for buttons, forms, modals, etc.
- **Use Tailwind's utility classes** rather than custom CSS when possible.

### 🔧 TypeScript & Type Safety
- **Use strict TypeScript configuration** with proper type definitions.
- **Define interfaces and types** in dedicated files within the `types/` directory.
- **Use proper typing for API responses, props, and state**.
- **Leverage TypeScript's utility types** (Pick, Omit, Partial, etc.) when appropriate.
- **Avoid `any` type** - use proper typing or `unknown` with type guards.

### 🧪 Testing & Reliability
- **Always create unit tests for new features** using Jest and React Testing Library.
- **After updating any logic**, check whether existing tests need to be updated. If so, do it.
- **Tests should live in a `__tests__` folder** or alongside components with `.test.tsx` extension.
  - Include at least:
    - 1 test for expected behavior
    - 1 edge case
    - 1 error handling case
- **Write integration tests** for API routes and critical user flows.

### ✅ Task Completion
- **Mark completed tasks in `TASK.md`** immediately after finishing them.
- Add new sub-tasks or TODOs discovered during development to `TASK.md` under a "Discovered During Work" section.

### 📎 Style & Conventions
- **Use TypeScript** as the primary language for all files.
- **Follow React and Next.js best practices** including proper use of hooks, server/client components, and API routes.
- **Use ESLint and Prettier** for code formatting and linting.
- **Follow naming conventions**:
  - Components: PascalCase (`UserProfile.tsx`)
  - Files/folders: kebab-case (`user-profile/`)
  - Functions/variables: camelCase (`getUserData`)
  - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Write **JSDoc comments for complex functions**:
  ```typescript
  /**
   * Fetches user data from the API with caching
   * @param userId - The unique identifier for the user
   * @param options - Optional configuration for the request
   * @returns Promise resolving to user data or null if not found
   */
  ```

### 🔌 API & Data Management
- **Use Next.js API routes** for server-side logic in the `app/api/` directory.
- **Implement proper error handling** with try-catch blocks and meaningful error messages.
- **Use appropriate HTTP status codes** and consistent API response formats.
- **Implement data validation** using libraries like Zod or Yup.
- **Use React Query/TanStack Query** or SWR for client-side data fetching and caching.

### 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add inline comments** explaining the why, not just the what.
- **Document component props** using TypeScript interfaces with descriptive comments.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified npm packages and Next.js features.
- **Always confirm file paths and imports** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.
- **Use Next.js 13+ App Router** unless specifically told to use Pages Router.
- **Distinguish between server and client components** and use appropriate patterns for each.