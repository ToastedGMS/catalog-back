# Catalog Back — API REST para Plataforma de E-commerce

**Este repositório é uma versão pública e sanitizada de um sistema proprietário desenvolvido para um cliente real. Por motivos de segurança, e atentando-me às normas da LGPD, o histórico de commits foi omitido, e os dados sensíveis foram removidos ou substituídos.**

Uma API de backend totalmente funcional para umaa plataforma de e-commerce, construída com Node.js, Express, TypeScript e Prisma. Este projeto gerencia produtos, categorias, usuários, autenticação e o rastreamento de atividades para o frontend.

## Funcionalidades

- Autenticação e Autorização com JWT.

- API de Produtos e Categorias para conteúdo dinâmico de e-commerce.

- Gerenciamento de Usuários com diferentes cargos (roles) e permissões.

- Rastreamento de Atividades para monitorar interações dos usuários.

- CORS configurado para integração com o frontend.

- Código com tipagem segura utilizando TypeScript e Prisma ORM.

- Arquitetura pronta para testes (Test Driven Development).

- Configuração baseada em ambiente via arquivo .env.

## Tecnologias

- Runtime: Node.js

- Framework: Express

- Banco de Dados: PostgreSQL (Prisma ORM)

- Linguagem: TypeScript

- Testes: Jest / React Testing Library (para testes de integração da API)

- Deploy: Railway.app

## Estrutura de Pastas (Simplificada)

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

## Endpoints (Exemplos)

- GET /api/categories — Busca todas as categorias.

- GET /api/products — Busca todos os produtos.

- POST /api/auth/login — Realiza o login do usuário.

- GET /api/activity — Rastreia ações do usuário.

## Deploy

- Hospedado no Railway.app.

- Builds automáticos via push no GitHub.

## 🙋‍♂️ Feedback é Bem-vindo

Este backend faz parte do meu portfólio full-stack. Sugestões, avisos de bugs (issues) ou ideias de melhoria são sempre bem-vindas!

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![NodeJs](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
