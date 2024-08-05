document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expensesList = document.getElementById('expenses');
    const totalAmount = document.getElementById('total-amount');
    let totalExpenses = 0;
    let updateMode = false;
    let expenseToUpdate = null;

    // Load expenses from local storage
    loadExpenses();

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const expenseName = expenseNameInput.value.trim();
        const expenseAmount = parseFloat(expenseAmountInput.value.trim());

        if (expenseName && !isNaN(expenseAmount)) {
            if (updateMode) {
                updateExpense(expenseName, expenseAmount);
            } else {
                addExpense(expenseName, expenseAmount);
            }

            expenseNameInput.value = '';
            expenseAmountInput.value = '';
        }
    });

    function addExpense(name, amount) {
        const expenseItem = document.createElement('li');
        expenseItem.innerHTML = `
            ${name} - ₹${amount.toFixed(2)}
            <button class="update-btn">Update</button>
            <button class="delete-btn">Delete</button>
        `;

        expenseItem.querySelector('.delete-btn').addEventListener('click', () => {
            totalExpenses -= amount;
            updateTotal();
            expensesList.removeChild(expenseItem);
            saveExpenses();
        });

        expenseItem.querySelector('.update-btn').addEventListener('click', () => {
            expenseNameInput.value = name;
            expenseAmountInput.value = amount;
            updateMode = true;
            expenseToUpdate = expenseItem;
        });

        expensesList.appendChild(expenseItem);
        totalExpenses += amount;
        updateTotal();
        saveExpenses();
    }

    function updateExpense(name, amount) {
        const oldAmount = parseFloat(expenseToUpdate.textContent.split(' - ₹')[1]);

        expenseToUpdate.innerHTML = `
            ${name} - ₹${amount.toFixed(2)}
            <button class="update-btn">Update</button>
            <button class="delete-btn">Delete</button>
        `;

        expenseToUpdate.querySelector('.delete-btn').addEventListener('click', () => {
            totalExpenses -= parseFloat(expenseToUpdate.textContent.split(' - ₹')[1]);
            updateTotal();
            expensesList.removeChild(expenseToUpdate);
            saveExpenses();
        });

        expenseToUpdate.querySelector('.update-btn').addEventListener('click', () => {
            expenseNameInput.value = name;
            expenseAmountInput.value = amount;
            updateMode = true;
            expenseToUpdate = expenseItem;
        });

        totalExpenses = totalExpenses - oldAmount + amount;
        updateTotal();
        saveExpenses();

        // Reset update mode
        updateMode = false;
        expenseToUpdate = null;
    }

    function updateTotal() {
        totalAmount.textContent = `₹${totalExpenses.toFixed(2)}`;
    }

    function saveExpenses() {
        const expenses = [];
        expensesList.querySelectorAll('li').forEach(expenseItem => {
            const [name, amount] = expenseItem.textContent.split(' - ₹');
            expenses.push({ name, amount: parseFloat(amount) });
        });
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('totalExpenses', totalExpenses.toString());
    }

    function loadExpenses() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;

        expenses.forEach(expense => {
            addExpense(expense.name, expense.amount);
        });

        updateTotal();
    }
});
