## Course2025 NodeJS-Project

## Description

Currently, the program is an NesttJS TypeScript Sequelize Mysql application with multiple endpoints for working with users, records and reviews. The application supports user authorization (local and sso), and works with a DiscogsAPI and Telegram.
The project contains a number of endpoints, which you can see on swagger documentation (api/docs).

## Installation

Make sure you have installed Node version 22.16.0 or higher, after that, download source code from repository.
Dont forget to install all the necessary dependencies using npm install.

## Usage

# Start the application

npm start

# Run the application in development mode

npm run start:debug

# Run ESLint to lint the codebase

npm run lint

# Run Prettier to check code formatting

npm run format

# Import new record entries(50 bu default) for record table in DB

npm run migrate

# Run tests

npm run test

# Run tests with coverage report

npm run test:coverage
