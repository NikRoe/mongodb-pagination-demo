import { useEffect, useState } from "react";

export default function HomePage() {
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(0);

  async function getExpenses(fetchURL = "api/expense") {
    const response = await fetch(fetchURL);

    if (response.ok) {
      const data = await response.json();
      setExpenses(data);
    }
  }
  useEffect(() => {
    getExpenses();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const expenseData = Object.fromEntries(formData);

    const response = await fetch("api/expense", {
      method: "POST",
      body: JSON.stringify(expenseData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      getExpenses();
    }
  }

  async function handleNextPage() {
    setPage(page + 1);

    const params = new URLSearchParams({ page: page + 1 });

    getExpenses(`api/expense?${params}`);
  }

  function handlePreviousPage() {
    setPage(page - 1);

    const params = new URLSearchParams({ page: page - 1 });

    getExpenses(`api/expense?${params}`);
  }

  return (
    <div>
      <h1>Hello from Next.js</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" name="name" required />
        <label htmlFor="amount">Amount:</label>
        <input required id="amount" type="number" name="amount" />
        <button type="submit">Add new expense</button>
      </form>
      <ol>
        {expenses.map((expense) => (
          <li key={expense._id}>
            {expense.name} - {expense.amount} €
          </li>
        ))}
      </ol>
      Current page: {page + 1}
      <div>
        <button
          type="button"
          onClick={handlePreviousPage}
          disabled={page === 0}
        >
          previous
        </button>
        <button type="button" onClick={handleNextPage}>
          next
        </button>
      </div>
    </div>
  );
}
