import { useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function HomePage() {
  const [page, setPage] = useState(0);
  const {
    data: expenses,
    error,
    isLoading,
  } = useSWR(`api/expense?page=${page}`, fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

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
      mutate("api/expense");
    }
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
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          previous
        </button>
        <button type="button" onClick={() => setPage(page + 1)}>
          next
        </button>
      </div>
    </div>
  );
}
