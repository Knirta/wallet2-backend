import { Category } from "../models/category.js";
import { ctrlWrapper } from "../helpers/index.js";
import { getMonthStatisticsService } from "../services/categories.js";

const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json({
    status: "success",
    code: 200,
    message: "Категорії успішно отримані",
    data: {
      categories,
    },
  });
};

const getCategoriesStatistics = async (req, res) => {
  const { _id: userId } = req.user;
  const { month, year } = req.query;
  const monthIndex = month - 1;
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 1);
  const { expenseStatistics, totalExpense, totalIncome } =
    await getMonthStatisticsService(userId, startDate, endDate);
  res.status(200).json({
    status: "success",
    code: 200,
    message: "Статистика категорій успішно отримана",
    data: {
      expenseStatistics,
      totalExpense,
      totalIncome,
    },
  });
};

export default {
  getCategories: ctrlWrapper(getCategories),
  getCategoriesStatistics: ctrlWrapper(getCategoriesStatistics),
};
