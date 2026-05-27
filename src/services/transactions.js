import mongoose from "mongoose";
import { Transaction } from "../models/transaction.js";
import { User } from "../models/user.js";

const addNewTransaction = async ({
  userId,
  type,
  category,
  amount,
  date,
  comment,
}) => {
  const amountInCents = Math.round(amount * 100);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const [newTransaction] = await Transaction.create(
      [{ userId, type, category, amount: amountInCents, date, comment }],
      {
        session,
      },
    );

    const updateAmount = type === "income" ? amountInCents : -amountInCents;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { $inc: { totalBalance: updateAmount } },
      { returnDocument: "after", session },
    );

    if (!updatedUser) {
      const error = new Error("Користувача не знайдено");
      error.status = 404;
      throw error;
    }

    if (updatedUser.totalBalance < 0) {
      const error = new Error("Недостатньо коштів для цієї транзакції");
      error.status = 400;
      throw error;
    }

    await session.commitTransaction();
    return {
      ...newTransaction.toObject(),
      amount: newTransaction.amount / 100,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getUserTransactions = async (userId) => {
  const transactions = await Transaction.find({ userId }).sort({ date: -1 });
  return transactions.map((transaction) => ({
    ...transaction.toObject(),
    amount: transaction.amount / 100,
  }));
};

export { addNewTransaction, getUserTransactions };
