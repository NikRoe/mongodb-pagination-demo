import connect from "@/db/dbConnect";
import Expense from "@/db/models/Expense";

export default async function handler(request, response) {
  await connect();

  if (request.method === "GET") {
    const { page } = request.query;
    const pagesToSkip = +page * 5;

    try {
      const expenses = await Expense.find().skip(pagesToSkip).limit(5);

      return response.status(200).json(expenses);
    } catch (error) {
      return response.json({ message: "Something went wrong", error: error });
    }
  }

  if (request.method === "POST") {
    const newExpense = request.body;

    try {
      await Expense.create(newExpense);
      response.status(201).json({ message: "Expense created." });
    } catch (error) {
      return response.json({ message: "Something went wrong", error: error });
    }
  }
}
