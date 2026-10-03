// This project includes the work of PHASE 1
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Pool } = require("pg");
const app = express();

// Connect to PostgreSQL using the database settings from .env
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Allow requests from different origins
app.use(cors());
app.use(express.json());

// Format date as DD-MM-YYYY
function formatDate(date) {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
}

// 1) Brings all the expenses
app.get("/api/expenses", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM expenses"
    );

    const expenses = result.rows.map(expense => ({
        ...expense,
        date: formatDate(expense.date)
    }));

    return res.status(200).json({
        message: expenses
    });
});

// 2) Bring the expense by the id
app.get("/api/expenses/:id", async (req, res) => {
    const id = req.params.id;

    // Check that the ID is a valid integer before querying the database
    if (!Number.isInteger(Number(id))) {
        return res.status(404).json({
            message: "Expense not found"
        });
    }

    // Use $1 to safely pass the ID to the SQL query
    const result = await pool.query(
        "SELECT * FROM expenses WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Expense not found"
        });
    }

    const expense = result.rows[0];
    expense.date = formatDate(expense.date);

    return res.status(200).json({
        message: expense
    });
});

// 3) Adding a new expense
app.post("/api/expenses", async (req, res) => {

    const { title, amount, category, date } = req.body;

    const allowedCategories = [
        "Food",
        "Transport",
        "Bills",
        "Entertainment",
        "Other"
    ];

    if (!date || !amount || !category || !title) {
        return res.status(400).json({
            message: "value is missing"
        });
    }

    if (!allowedCategories.includes(category)) {
        return res.status(400).json({
            message: "Invalid category"
        });
    }

    if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
            message: "amount must be a number greater than zero"
        });
    }

    const today = new Date();
    const expenseDate = new Date(date);

    if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
            message: "Invalid date"
        });
    }

    if (expenseDate > today) {
        return res.status(400).json({
            message: "Expense date cannot be in the future"
        });
    }

    const result = await pool.query(
        "INSERT INTO expenses (title, amount, category, date) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, amount, category, expenseDate]
    );

    const expense = result.rows[0];
    expense.date = formatDate(expense.date);

    return res.status(201).json({
        message: "Expense created successfully",
        expense: expense
    });
});

// 4) Altering an expense
app.put("/api/expenses/:id", async (req, res) => {

    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        return res.status(404).json({
            message: "Expense not found"
        });
    }

    const { title, amount, category, date } = req.body;

    const allowedCategories = [
        "Food",
        "Transport",
        "Bills",
        "Entertainment",
        "Other"
    ];

    if (!date || !amount || !category || !title) {
        return res.status(400).json({
            message: "value is missing"
        });
    }

    if (!allowedCategories.includes(category)) {
        return res.status(400).json({
            message: "Invalid category"
        });
    }

    if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
            message: "amount must be a number greater than zero"
        });
    }

    const today = new Date();
    const expenseDate = new Date(date);

    if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({
            message: "Invalid date"
        });
    }

    if (expenseDate > today) {
        return res.status(400).json({
            message: "Expense date cannot be in the future"
        });
    }

    const result = await pool.query(
        `UPDATE expenses
         SET title = $1,
             amount = $2,
             category = $3,
             date = $4
         WHERE id = $5
         RETURNING *`,
        [title, amount, category, expenseDate, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Expense not found"
        });
    }

    const expense = result.rows[0];
    expense.date = formatDate(expense.date);

    return res.status(200).json({
        message: "Expense updated successfully",
        expense: expense
    });
});

// 5) delete a row
app.delete("/api/expenses/:id", async (req, res) => {

    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        return res.status(404).json({
            message: "Expense not found"
        });
    }

    const result = await pool.query(
        `DELETE FROM expenses
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Expense not found"
        });
    }

    const expense = result.rows[0];
    expense.date = formatDate(expense.date);

    return res.status(200).json({
        message: "Expense deleted successfully",
        expense: expense
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});