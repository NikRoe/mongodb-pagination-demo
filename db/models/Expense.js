import mongoose from "mongoose";

const { Schema } = mongoose;

const expenseSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
