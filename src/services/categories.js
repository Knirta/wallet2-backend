import mongoose from "mongoose";
import { Transaction } from "../models/transaction.js";

export const getMonthStatisticsService = async (userId, startDate, endDate) => {
  const expenseStatistics = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lt: endDate },
        type: "expense",
      },
    },
    {
      $group: { _id: "$category", totalAmount: { $sum: "$amount" } },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        // pipeline: [{ $project: { name: 1, icon: 1, color: 1 } }],
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },
    {
      $project: {
        _id: 0,
        id: "$_id",
        totalAmount: { $divide: ["$totalAmount", 100] },
        name: "$categoryDetails.name",
        icon: "$categoryDetails.icon",
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  const totalExpense = expenseStatistics.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  const totalIncome = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: startDate,
          $lt: endDate,
        },
        type: "income",
      },
    },
    {
      $group: { _id: null, totalAmount: { $sum: "$amount" } },
    },
  ]);

  return {
    expenseStatistics,
    totalExpense,
    totalIncome: totalIncome[0]?.totalAmount / 100 || 0,
  };
};
