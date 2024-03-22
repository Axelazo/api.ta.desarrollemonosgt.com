# API Technical Assesment for Corporacion de Confianza

## Technical Assessment README

### Overview

This repository contains the codebase for an API/backend server technical assessment project aimed at building a web application with features including user management, authentication, store management, and product management. The application is built using Node.js for the backend, and Sequelize as the ORM for interacting with the MySQL database.

# Features

- User Registration: Users can register with their name, email, and password. Passwords are securely hashed before storing in the database.
- User Authentication: Users can log in securely using their registered credentials. JWT tokens are used for session management.
- Store Management: Admin users can add, list, update, and logically delete stores. Each store's associated products are displayed.
- Product Management: Admin users can add, list, update, and logically delete products. Each product must be associated with a store.
- Clean Architecture: The backend is structured (hopefully) following best practices, ensuring modularity, reusability, and maintainability.

### Technologies Used

- Backend: Node.js
- Database: MySQL (with Sequelize ORM)
- Authentication: JWT
- Other tools: npm for package management, Sequelize CLI for database migrations

### Setup Instructions

1. Clone the repository:
   `git clone api.ta.desarrollemnosgt.com`

2. Navigate to the project root directory:
   `cd <project-directory>`

3. Install dependencies
   `npm install`

4. Set up the database:

- Create a SQL database instance.
- Configure the database connection in backend/config/database.js.
- Run database migrations and seeders to set up the schema and initial dummy data
  `npm run migrate && npm run seed`

5. Start the backend/API server in dev mode
   `npm run dev`
