import { ctrlWrapper } from "../helpers/index.js";
import {
  addNewTransaction,
  getUserTransactions,
} from "../services/transactions.js";

const addTransaction = async (req, res) => {
  const { _id: userId } = req.user;
  const transactionData = { ...req.body, userId };
  const { newTransaction, totalBalance } =
    await addNewTransaction(transactionData);

  res.status(201).json({
    status: "success",
    code: 201,
    message: "Транзакція успішно додана",
    data: {
      transaction: newTransaction,
      totalBalance,
    },
  });
};

const getTransactions = async (req, res) => {
  const { _id: userId } = req.user;
  const { limit = 12, page = 1 } = req.query;
  const skip = Number(limit) * (Number(page) - 1);
  const result = await getUserTransactions(userId, limit, skip);
  res.status(200).json({
    status: "success",
    code: 200,
    message: "Транзакції успішно отримані",
    data: {
      transactions: result.transactions,
      totalPages: result.totalPages,
      currentPage: Number(page),
    },
  });
};

export default {
  addTransaction: ctrlWrapper(addTransaction),
  getTransactions: ctrlWrapper(getTransactions),
};
