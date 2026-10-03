# Expense Tracker

A full-stack web application for managing personal expenses. Users can add, view, edit, delete, and filter expenses by category, with the data stored in a PostgreSQL database.
## How to run

### **Backend**

1. Open the `backend` folder in the terminal.
2. Install the required dependencies:
 npm install
3. Create a PostgreSQL database for the project.
4. Run the schema.sql file on the created database to create the required table.
5. Create a .env file inside the backend folder with the following variables:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_postgresql_username
DB_PASSWORD=your_postgresql_password
6. Start the backend server:
node server.js
7. The backend will run on:
http://localhost:3000

### **Frontend**

1. Open the `frontend` folder.
2. Open `test.html` in a web browser.

## Features

<!-- List what your app can do. Tick what you finished. -->

- [x] Add an expense (with validation)
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category
- [x] Summary cards (total, count, highest)
- [x] Data is saved in a PostgreSQL database

## Screenshots
all the screenshots that are required in phase 1 and 3 are in the screenshots file 

## What was the hardest part?

The hardest part was connecting the frontend to the backend API and understanding how Fetch API and async/await work. At first, it was a little difficult to understand how requests are sent from the frontend and how to wait for the response. I solved this by practicing with Fetch and async/await and using them to add, edit, delete, and filter expenses. I also added validation and error messages to handle invalid input and failed requests.
