# React Habit Tracker

## Stack
React, Material UI, Chart.js, Vitest, React Testing Library

## Structure
src/
  App.jsx             — Routes (BrowserRouter)
  components/
    Habits/           — Paginated daily habit checklist (main feature)
    Summary/          — Monthly radar chart
    Trends/           — Streak bar chart
    NavBar/           — Bottom navigation
  utils/
    apiFetch.js       — Fetch wrapper with auth
  test/               — Vitest + RTL tests

## Habits Component
Displays a paginated table of 10 habits per page from the database.
- On load, shows the current day's habits (based on the user's timezone) with unchecked checkmarks.
- On a new day (based on the user's timezone), shows habits again with unchecked checkmarks.
- Checkmarks can always be toggled regardless of the day.

## API
Base URL: http://localhost:3000

All endpoints require JWT Bearer token in Authorization header (except auth).
Unauthorized requests return 401.

### Auth
POST /auth/login
  Auth: none
  Input:  { "email": "string", "password": "string" }
  Output: { "token": "string", "message": "User authenticated" }

POST /auth/signup
  Auth: none
  Input:  { "email": "string", "password": "string" }
  Output: { "Succesfully registered": "string" }

### Habits
GET /habits
  Auth: JWT
  Input:  none
  Output: { "habits": [{ "id": number, "habit": "string", "completed": 0|1, "date": "string", "user_id": number }] }

POST /habits
  Auth: JWT
  Input:  { "habit": "string", "completed": "0"|"1" }
  Output: { "affectedRows": number }

PATCH /habits
  Auth: JWT
  Input:  { "habitId": "string", "habitNameReplacement": "string" }
  Output: { "affectedRows": number }

DELETE /habits/:id
  Auth: JWT
  Input:  none
  Output: { "affectedRows": number }

### Habits History
GET /habits-history
  Auth: JWT
  Input:  none
  Output: { "completion_checks": [{ "id": number, "habit_id": number, "completion_check": 0|1 }] }

GET /habits-history/:month
  Auth: JWT
  Input:  none (month format: YYYY-MM)
  Output: { "YYYY-MM": [number, number, ...] }

GET /habits-history/streaks
  Auth: JWT
  Input:  none
  Output: [{ "habit": "string", "streak": number }]

POST /habits-history
  Auth: JWT
  Input:  { "date": "YYYY-MM-DD" }
  Output: { "affectedRows": number }

PUT /habits-history
  Auth: JWT
  Input:  { "id": number, "date": "YYYY-MM-DD" }
  Output: { "affectedRows": number }

### Dates
GET /dates
  Auth: JWT
  Input:  none
  Output: { "dates": [{ "date": "YYYY-MM-DD" }] }

POST /dates/:date
  Auth: JWT
  Input:  none (date format: YYYY-MM-DD)
  Output: { "affectedRows": number }

## Git Workflow
To commit changes:
1. Run `git add -A` to stage all changes.
2. Review with `git status` and `git diff --staged`.
3. Commit using Conventional Commits format: `<type>(<scope>): <description>`.
4. Wait for user confirmation before running `git push`.
