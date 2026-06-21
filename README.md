# Habit tracker
*July 2025 - present*

Habit tracking application built with React and backend with Express.js. The goal of this project is to provide a simple way to track your daily habits, monitor streaks, and visualize your progress over time.

**Backend repository:** [express-habit-tracker](https://github.com/mathewsecure/express-habit-tracker)

> **Note:** This project is currently in active development. Features are subject to change.

## Key features

### Daily tracking

<img width="1450" height="2936" alt="localhost_5173_habits(iPhone 14 Pro Max) (1)-portrait" src="https://github.com/user-attachments/assets/bc0887d3-eaf3-4564-84b4-a6a9db3b0bf3" />

### Visualize your progress

<img width="1450" height="2936" alt="localhost_5173_summary(iPhone 14 Pro Max) (1)-portrait" src="https://github.com/user-attachments/assets/5384e0a9-0132-4f14-95e2-9db82c86d9c9" />


### Monitor streaks


<img width="1450" height="2936" alt="localhost_5173_trends(iPhone 14 Pro Max) (1)-portrait" src="https://github.com/user-attachments/assets/34746430-e4a3-4fde-9b5f-679dd17d0ded" />

## Setup

### 1. Environment variables

Copy `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `VITE_API_HOST_TEST` | Backend URL (e.g. `http://localhost:3000`) |
| `VITE_TOKEN_TEST` | JWT token from `POST /auth/login` |

### 2. Run the app

```bash
npm install
npm run dev
```

### 3. Run tests

```bash
npm test            # watch mode
npm run coverage    # with coverage report
```

## Technologies used

### Frontend
- React
- Material UI
- Chart.js
- Intl API
- Vitest
- React Testing Library

### Backend
- Express.js
- Node.js
- MySQL
- Jest
- Supertest
- JSON Web Token (JWT)

**Backend repository:** [express-habit-tracker](https://github.com/mathewsecure/express-habit-tracker)
