# Catálogo Online - Backend

REST API totalmente funcional construída para servir o [Front-end](https://github.com/ToastedGMS/catalog-front). Construída com **Node.js**, **Express**, **TypeScript** e **Prisma ORM**. Este Back-end fornece produtos, categorias, usuários, autenticação, e um log de atividades para o frontend.

## 🚀 Features

- Autenticação JWT

- API de e-commerce para alimentação dinâmica de produtos e categorias

- Administração de usuários

- Log de atividades para monitoramento de ações

- Type-safety e clean code com TypeScript e Prisma ORM

- Foco em testes unitários (Test Driven Development)

## 🔧 Tech Stack

- Runtime: Node.js

- Framework: Express

- Database: PostgreSQL (Prisma ORM)

- Linguagem: TypeScript

- Testes: Jest / React Testing Library (for API integration tests)

- Deployment: Railway

## 🗂️ Folder Structure (Simplified)

```

src/
├── routers/       # Express routers (categories, products, users, auth, activity)
├── controllers/   # Request handlers for API endpoints
├── middlewares/   # Custom middleware (auth, error handling, CORS)
├── services/      # Business logic (e.g., validation, data transformation)
├── prisma/        # Prisma client & migrations
├── utils/         # Helpers and shared utilities
└── types/         # TypeScript interfaces and types

```

## 📦 Endpoints

- GET /api/categories — Buscar Categorias

- GET /api/products — Buscar Produtos

- POST /api/auth/login — Login

- POST /api/users — Criação de usuários

- GET /api/activity — Log de atividades

## 📌 Deployment

- Hosting via Railway.app

- Automatic builds via GitHub Actions

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat)
![Prisma ORM](https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
