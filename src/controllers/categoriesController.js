import { Category } from "../models/category.js";
import { ctrlWrapper } from "../helpers/index.js";

const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

export default {
  getCategories: ctrlWrapper(getCategories),
};
