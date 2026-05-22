import { ctrlWrapper } from "../helpers/index.js";
import { addNewTransaction } from "../services/transactions.js";

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

export default {
  addTransaction: ctrlWrapper(addTransaction),
};
