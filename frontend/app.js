
document.getElementById("expenseform").addEventListener("submit", async (event) => {
         event.preventDefault();

    const expense = {
        title: document.getElementById("title").value,
      amount: Number(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };
    if (expense.title === "" || expense.amount <= 0 || expense.date === "") {
    const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-danger">
            Please fill in all fields correctly.
        </div>
    `;

    return;
}const today = new Date().toISOString().split("T")[0];

if (expense.date > today) {
    const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-danger">
            Date cannot be in the future.
        </div>
    `;

    return;
}
    try{
     const response = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
    });

    const data = await response.json();

   
    const messageBox = document.getElementById("messageBox");

    if(response.status==201){
messageBox.innerHTML = `
    <div class="alert alert-success">
       ${data.message}
    </div>
`;
getExpenses();}
else
if (response.status === 400) {
    messageBox.innerHTML = `
        <div class="alert alert-danger">
            ${data.message}
        </div>
    `;
}
}

catch(error) {
    console.error(error);

    const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-danger">
            Failed to add expense.
        </div>
    `;
}});


async function getExpenses (){
     const loadingSpinner = document.getElementById("loadingSpinner");

    try{
       loadingSpinner.classList.remove("d-none");
const response = await fetch("http://localhost:3000/api/expenses");
const data = await response.json();

        const expensesTable = document.getElementById("expensesTable");
const expenses = data.message;
const selectedCategory = document.getElementById("categoryFilter").value;
let filteredExpenses = expenses;

if (selectedCategory !== "All") {
    filteredExpenses = expenses.filter(expense => {
        return expense.category === selectedCategory;
    });
}
const expenseCount = expenses.length;
document.getElementById("expenseCount").textContent = expenseCount;
let totalAmount = 0;

expenses.forEach(expense => {
    totalAmount += Number(expense.amount);
});

document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);
let highestExpense = 0;

expenses.forEach(expense => {
    if (Number(expense.amount) > highestExpense) {
        highestExpense = Number(expense.amount);
    }
});

document.getElementById("highestExpense").textContent = highestExpense.toFixed(2);
 expensesTable.innerHTML = "";
filteredExpenses.forEach(expense => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${expense.title}</td>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td>
    <button class="btn btn-warning edit-btn" data-id="${expense.id}">
        Edit
    </button>

    <button class="btn btn-danger delete-btn" data-id="${expense.id}">
        Delete
    </button>
</td>
    `;
     expensesTable.appendChild(row);
});
document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async () => {
        const id = button.dataset.id;

        try {
            const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

          if (response.status === 200) {
    const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-success">
            ${data.message}
        </div>
    `;

    getExpenses();
} else {
    const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-danger">
            ${data.message}
        </div>
    `;
}

        } catch(error) {
    console.error(error);

    const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-danger">
            Failed to delete expense.
        </div>
    `;
}
    });
});
document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
        const id = button.dataset.id;

        const expense = expenses.find(expense => expense.id == id);

        document.getElementById("editId").value = expense.id;
        document.getElementById("editTitle").value = expense.title;
        document.getElementById("editAmount").value = expense.amount;
        document.getElementById("editCategory").value = expense.category;

        const dateParts = expense.date.split("-");

        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        document.getElementById("editDate").value = formattedDate;
        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
editModal.show();
    });
});
 } catch(error) {
        console.error(error);
          const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-danger">
            Failed to load expenses.
        </div>
    `;
    }
finally {
    loadingSpinner.classList.add("d-none");
}
}
getExpenses();
document.getElementById("saveEdit").addEventListener("click", async () => {

    const id = document.getElementById("editId").value;
    const title = document.getElementById("editTitle").value;
    const amount = Number(document.getElementById("editAmount").value);
    const category = document.getElementById("editCategory").value;
    const date = document.getElementById("editDate").value;
const expense = {
    title: title,
    amount: amount,
    category: category,
    date: date
};
try {
    const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
    });

    const data = await response.json();
if (response.status === 200) {
    const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-success">
            ${data.message}
        </div>
    `;

    getExpenses();

    const editModal = bootstrap.Modal.getInstance(
        document.getElementById("editModal")
    );

    editModal.hide();

} else {
    const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-danger">
            ${data.message}
        </div>
    `;
}
} catch(error) {
    console.error(error);

    const messageBox = document.getElementById("messageBox");

    messageBox.innerHTML = `
        <div class="alert alert-danger">
            Failed to update expense.
        </div>
    `;
}
});
document.getElementById("categoryFilter").addEventListener("change", () => {
    getExpenses();
});