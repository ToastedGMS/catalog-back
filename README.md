# Paulada Games Backend — REST API for E-commerce Platform

A fully functional backend API for the Paulada Games e-commerce platform, built with Node.js, Express, TypeScript, and Prisma. This project powers products, categories, users, authentication, and activity tracking for the live frontend.

## 🚀 Features

- 🔐 Authentication & Authorization with JWT

- 🛒 Products & Categories API for dynamic e-commerce content

- 👤 User Management with roles and permissions

- 📈 Activity Tracking to monitor user interactions

- ⚡ CORS configured for frontend integration

- 🧼 Type-safe code with TypeScript and Prisma ORM

- 🧪 Testing-ready architecture (TDD encouraged)

- 🔧 Environment-based configuration with .env

## 🔧 Tech Stack

- Runtime: Node.js

- Framework: Express

- Database: PostgreSQL (Prisma ORM)

- Language: TypeScript

- Testing: Jest / React Testing Library (for API integration tests)

- Deployment: Railway.app

## 🗂️ Folder Structure (Simplified)
src/
├── routers/       # Express routers (categories, products, users, auth, activity)
├── controllers/   # Request handlers for API endpoints
├── middlewares/   # Custom middleware (auth, error handling, CORS)
├── services/      # Business logic (e.g., validation, data transformation)
├── prisma/        # Prisma client & migrations
├── utils/         # Helpers and shared utilities
└── types/         # TypeScript interfaces and types

## 📦 Endpoints (Examples)

- GET /api/categories — Fetch all categories

- GET /api/products — Fetch all products

- POST /api/auth/login — User login

- POST /api/users — Create new user

- GET /api/activity — Track user actions

**Full documentation and endpoint details are under development.**

🛠️ Setup
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build


Environment variables required (.env):

DATABASE_URL=postgresql://username:password@host:port/dbname
JWT_SECRET=your_jwt_secret
PORT=3000

## 📌 Deployment

- Hosted on Railway.app

- Custom domain integration with pauladagames.com.br

- Automatic builds via GitHub push

## 🙋‍♂️ Feedback Welcome

This backend is part of my full-stack portfolio. Suggestions, issues, or improvement ideas are always welcome.
