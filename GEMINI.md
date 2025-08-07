
# GEMINI.md

## Project Overview

This is a web application for managing an aesthetic clinic. It's built with Next.js, TypeScript, and Prisma, using a PostgreSQL database. The application provides functionalities for managing appointments, patients, procedures, products, stock, finances, and users. It also includes a dashboard for data visualization.

### Key Technologies

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **ORM:** Prisma
*   **Database:** PostgreSQL
*   **Styling:** Tailwind CSS
*   **Authentication:** NextAuth.js

## Building and Running

### Prerequisites

*   Node.js
*   Yarn
*   Docker (for running a local PostgreSQL instance)

### Setup

1.  **Install dependencies:**
    ```bash
    yarn install
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables:
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="YOUR_SECRET"
    ```

3.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```

4.  **Seed the database (optional):**
    ```bash
    npx prisma db seed
    ```

### Running the application

*   **Development:**
    ```bash
    yarn dev
    ```

*   **Production:**
    ```bash
    yarn build
    yarn start
    ```

### Testing

*   **Linting:**
    ```bash
    yarn lint
    ```

## Development Conventions

*   **Code Style:** The project uses ESLint and Prettier for code formatting and style checking.
*   **Commits:** Conventional Commits are recommended for commit messages.
*   **Branching:** GitFlow is the recommended branching model.

## Application Structure

The application is structured as follows:

*   `app/`: Contains the main application code, with each subdirectory representing a feature.
    *   `api/`: API routes.
    *   `agendamentos/`: Appointment management.
    *   `dashboard/`: Dashboard and data visualization.
    *   `estoque/`: Stock management.
    *   `financeiro/`: Financial management.
    *   `historico/`: Patient history.
    *   `pacientes/`: Patient management.
    *   `procedimentos/`: Procedure management.
    *   `produtos/`: Product management.
    *   `relatorios/`: Reports.
    *   `usuarios/`: User management.
*   `components/`: Reusable React components.
*   `lib/`: Shared libraries and utilities.
*   `prisma/`: Prisma schema and migrations.
*   `scripts/`: Scripts for development and automation.
