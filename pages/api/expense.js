import connect from "@/db/dbConnect";
import Expense from "@/db/models/Expense";

export default async function handler(request, response) {
  await connect();

  if (request.method === "GET") {
    const page = parseInt(request.query.page, 10) || 0;
    const limit = parseInt(request.query.limit, 10) || 5;

    const pagesToSkip = page * limit;

    try {
      const [expenses, totalCount] = await Promise.all([
        Expense.find().skip(pagesToSkip).limit(limit),
        Expense.countDocuments(),
      ]);

      const hasNextPage = totalCount > (page + 1) * limit;

      return response.status(200).json({ hasNextPage, expenses });
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
