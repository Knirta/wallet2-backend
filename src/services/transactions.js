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

    const [newTransaction] = await Transaction.create(
      [
        {
          userId,
          type,
          category,
          amount: amountInCents,
          date,
          comment,
          balanceAfter: updatedUser.totalBalance,
        },
      ],
      {
        session,
      },
    );

    const populatedTransaction = await Transaction.findById(newTransaction._id)
      .populate("category")
      .session(session);

    await session.commitTransaction();
    return {
      newTransaction: {
        ...populatedTransaction.toObject(),
        amount: populatedTransaction.amount / 100,
        balanceAfter: populatedTransaction.balanceAfter / 100,
      },
      totalBalance: updatedUser.totalBalance / 100,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getUserTransactions = async (userId, limit, skip) => {
  const totalCount = await Transaction.countDocuments({ userId });
  const totalPages = Math.ceil(totalCount / limit);

  const transactions = await Transaction.find({ userId })
    .populate("category")
    .sort({ date: -1 })
    .limit(Number(limit))
    .skip(Number(skip));

  const returnedTransactions = transactions.map((transaction) => ({
    ...transaction.toObject(),
    amount: transaction.amount / 100,
    balanceAfter: transaction.balanceAfter / 100,
  }));
  return {
    transactions: returnedTransactions,
    totalPages,
  };
};

export { addNewTransaction, getUserTransactions };
