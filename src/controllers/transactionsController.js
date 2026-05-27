import { ctrlWrapper } from "../helpers/index.js";
import {
  addNewTransaction,
  getUserTransactions,
} from "../services/transactions.js";

const addTransaction = async (req, res) => {
  const { _id: userId } = req.user;
  const transactionData = { ...req.body, userId };
  const newTransaction = await addNewTransaction(transactionData);

  res.status(201).json({
    status: "success",
    code: 201,
    message: "Транзакція успішно додана",
    data: {
      transaction: newTransaction,
    },
  });
};

const getTransactions = async (req, res) => {
  const { _id: userId } = req.user;
  const transactions = await getUserTransactions(userId);
  res.status(200).json({
    status: "success",
    code: 200,
    message: "Транзакції успішно отримані",
    data: {
      transactions,
    },
  });
};

export default {
  addTransaction: ctrlWrapper(addTransaction),
  getTransactions: ctrlWrapper(getTransactions),
};
