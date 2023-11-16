import { useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function HomePage() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const { data, error, isLoading } = useSWR(
    `api/expense?page=${page}&limit=${limit}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const { expenses, hasNextPage } = data;

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
      <label htmlFor="limit-select">Set expenses per page:</label>
      <select
        name="limit"
        id="limit-select"
        onChange={(event) => setLimit(event.target.value)}
        value={limit}
      >
        <option value="">--Please choose an option--</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      Current page: {page + 1}
      <div>
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          previous
        </button>

        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage}
        >
          next
        </button>
      </div>
    </div>
  );
}
