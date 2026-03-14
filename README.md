# Rock Vote 🌳
### Hire Brandon National Park

A community platform for park residents to report local issues and vote on the ones they want addressed. Built as a full-stack web application with a React frontend and Node.js/Express backend.

## What It Does

- Create an account and log in securely
- Submit issues affecting your local park (broken equipment, potholes, lighting, etc.)
- Vote on issues submitted by other community members — one vote per user per issue
- See who submitted each issue and how many votes it has

## Tech Stack

**Frontend**

- React (Vite)

**Backend**

- Node.js
- Express
- MongoDB (Atlas)
- Mongoose
- JSON Web Tokens (JWT) — for authentication
- bcryptjs — for password hashing
- nodemon — for development auto-restart

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account with a cluster set up

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Trooper929/Rock-vote.git
cd rock-vote
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd Rock
npm install
cd ..
```

### 4. Create your environment file

In the root of the project, create a `.env` file:

```
PORT=4000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

### 5. Run the app

In one terminal, start the backend:

```bash
npm run dev
```

In a second terminal, start the frontend:

```bash
cd Rock
npm run dev
```

- Backend runs on `http://localhost:4000`
- Frontend runs on `http://localhost:5173`

## API Routes

| Method | Route               | Description       | Auth Required |
| ------ | ------------------- | ----------------- | ------------- |
| POST   | `/api/users/signup` | Create an account | No            |
| POST   | `/api/users/login`  | Log in            | No            |
| GET    | `/api/issues`       | Get all issues    | Yes           |
| POST   | `/api/issues`       | Create an issue   | Yes           |
| PUT    | `/api/issues/:id`   | Vote on an issue  | Yes           |
| DELETE | `/api/issues/:id`   | Delete an issue   | Yes           |
