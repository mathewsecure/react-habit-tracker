# React Habit Tracker

Daily habit tracking app. Users check off daily habits, view monthly completion radar charts, and track streaks over time.

## Stack

React, Material UI, Chart.js, Vitest, React Testing Library

## API Requests

All API calls use `apiFetch(endpoint, method, body)` from `src/utils/apiFetch.js`. It reads the API host and JWT token from `.env`, sends JSON, and returns parsed JSON. Always handle errors and loading states.

## Coding Guidelines

- No `console.log` in production code.
- Update local state immediately after successful API mutations (optimistic or direct update).
- Handle loading, empty, and error states for all async operations.

## Structure

src/
App.jsx — Routes (BrowserRouter, no index route yet)
components/
Habits/ — Paginated daily habit checklist (main feature)
Summary/ — Monthly radar chart
Trends/ — Streak bar chart
NavBar/ — Bottom navigation
utils/
apiFetch.js — Fetch wrapper with auth
test/ — Vitest + RTL tests

## Component Details

### Habits

Displays a paginated table of 10 habits per page from the database.

- On load, shows the current day's habits (based on the user's timezone) with unchecked checkmarks.
- On a new day (based on the user's timezone), shows habits again with unchecked checkmarks.
- Checkmarks can always be toggled regardless of the day.
- Pagination: 10 items per page, Prev/Next buttons.
- If there are fewer than 10 habits, shows an input to create a new one.

### Summary

Fetches unique months from dates, habit names, and monthly completion counts. Renders a Radar chart with month selector dropdown.

### Trends

Fetches streak data from `/habits-history/streaks`. Renders a horizontal Bar chart.

### NavBar

Bottom navigation bar with buttons linking to Habits, Summary, and Trends. Uses MUI AppBar with fixed bottom position.

## Resources

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `.env` — Required: `VITE_API_HOST_TEST` and `VITE_TOKEN_TEST`

## API

Base URL: http://localhost:3000

All endpoints require JWT Bearer token in Authorization header (except auth).
Unauthorized requests return 401.

### Auth

POST /auth/login
Auth: none
Input: { "email": "string", "password": "string" }
Output: { "token": "string", "message": "User authenticated" }

POST /auth/signup
Auth: none
Input: { "email": "string", "password": "string" }
Output: { "Succesfully registered": "string" }

### Habits

GET /habits
Auth: JWT
Input: none
Output: { "habits": [{ "id": number, "habit": "string", "completed": 0|1, "date": "string", "user_id": number }] }

POST /habits
Auth: JWT
Input: { "habit": "string", "completed": "0"|"1" }
Output: { "affectedRows": number }

PATCH /habits
Auth: JWT
Input: { "habitId": "string", "habitNameReplacement": "string" }
Output: { "affectedRows": number }

DELETE /habits/:id
Auth: JWT
Input: none
Output: { "affectedRows": number }

### Habits History

GET /habits-history
Auth: JWT
Input: none
Output: { "completion_checks": [{ "id": number, "habit_id": number, "completion_check": 0|1 }] }

GET /habits-history/:month
Auth: JWT
Input: none (month format: YYYY-MM)
Output: { "YYYY-MM": [number, number, ...] }

GET /habits-history/streaks
Auth: JWT
Input: none
Output: [{ "habit": "string", "streak": number }]

POST /habits-history
Auth: JWT
Input: { "date": "YYYY-MM-DD" }
Output: { "affectedRows": number }

PUT /habits-history
Auth: JWT
Input: { "id": number, "date": "YYYY-MM-DD" }
Output: { "affectedRows": number }

### Dates

GET /dates
Auth: JWT
Input: none
Output: { "dates": [{ "date": "YYYY-MM-DD" }] }

POST /dates/:date
Auth: JWT
Input: none (date format: YYYY-MM-DD)
Output: { "affectedRows": number }

## DB Reset (start fresh with 10 habits)

To delete all habits and create exactly 10:

1. `POST /auth/login` with `{ email, password }` → save token
2. `GET /habits` → list all habits
3. `DELETE /habits/:id` in loop for each existing habit
4. `POST /habits` x10 with `{ habit: "Habit N", completed: "0" }`

If DELETE returns 500 (FK constraint), skip that habit and leave it.
After creating, verify with `GET /habits` that you have exactly 10 (or 16 if old ones remain).

## Git Workflow

To commit changes:

1. Run `git add -A` to stage all changes.
2. Review with `git status` and `git diff --staged`.
3. Commit using Conventional Commits format: `<type>(<scope>): <description>`.
4. Wait for user confirmation before running `git push`.
