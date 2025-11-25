# JobHub Frontend

This is the frontend for JobHub, a comprehensive job recruitment platform built with Next.js. JobHub is a microservices-based application designed to connect job seekers with employers efficiently.

## Overview

JobHub is a complete job recruitment platform featuring:
- Job search and filtering capabilities
- User authentication for job seekers and employers
- Application management system
- Company profiles and job postings
- Resume upload and management
- Interview scheduling

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: [Add your UI library if any]
- **State Management**: [Add state management solution if any]
- **API Communication**: [Add API solution - fetch, axios, etc.]

## Project Structure

```bash
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── lib/             # Utility functions and libraries
├── public/          # Static assets
└── styles/          # Global styles
```

## Environment Variables

Create a `.env.local` file in the root of the `front-end` directory:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_SERVICE_URL=http://localhost:8081
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework.

## Microservices Architecture

This frontend is part of a microservices architecture. The backend services are located in separate repositories/directories:
- [Backend Services](../backends/README.md) - Authentication, Job Management, User Management, etc.

## Deployment

The frontend can be deployed using Vercel or any other hosting platform that supports Next.js applications.
