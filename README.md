# Quizz
This is an *in development* real-time quizzing application. This application is built on WebSockets for real-time communication. It uses an ExpressJS API in the backend and a NextJS frontend to interact.

This repo contains both the backend and frontend code.

You can find the latest deployed version at [https://quizz.jaminstratford.com](https://quizz.jaminstratford.com)

## Features
Here are the current features in this application

* Quiz creation editor
* Import and export quizzes
* Join quiz with unique name
* Time-based scoring system

## Progress
Here are a list of planned features to be added.

[ ] Results-based quiz (A way to quiz applicants or students)

## Running Application Locally
Before running the application you will need to setup the `.env` files.

```
cd backend && cp .env.example .env
cd frontend && cp .env.example .env
```

You can run the backend server of the application like so

```bash
# Accessing backend directory
cd backend
# Install dependencies locally
npm install

# Run normally
npm run start
# Run in watch mode
npm run watch
```

You can run the frontend of the application like so

```bash
# Accessing frontend directory
cd frontend
# Install dependencies locally
npm install
# Run in development mode
npm run dev
```

You can then access the application at http://localhost:3000
