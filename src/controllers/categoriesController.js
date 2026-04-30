import { Category } from "../models/category.js";
import { ctrlWrapper } from "../helpers/index.js";

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

export default {
  getCategories: ctrlWrapper(getCategories),
};
