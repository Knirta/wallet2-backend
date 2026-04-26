import { Category } from "../models/category.js";

const defaultCategories = [
  { name: "Зарплата", type: "income", icon: "salary", color: "#4CAF50" },
  { name: "Подарунки", type: "income", icon: "gift", color: "#2196F3" },
  { name: "Фріланс", type: "income", icon: "freelance", color: "#FF9800" },
  {
    name: "Інші доходи",
    type: "income",
    icon: "other-income",
    color: "#9C27B0",
  },
  { name: "Продукти", type: "expense", icon: "groceries", color: "#FF5722" },
  {
    name: "Транспорт",
    type: "expense",
    icon: "transportation",
    color: "#795548",
  },
  {
    name: "Дозвілля",
    type: "expense",
    icon: "entertainment",
    color: "#E91E63",
  },
  {
    name: "Комунальні послуги",
    type: "expense",
    icon: "utilities",
    color: "#3F51B5",
  },
  { name: "Здоров'я", type: "expense", icon: "health", color: "#009688" },
  { name: "Освіта", type: "expense", icon: "education", color: "#673AB7" },
  {
    name: "Товари для дому",
    type: "expense",
    icon: "home-goods",
    color: "#FF9800",
  },
  {
    name: "Інші витрати",
    type: "expense",
    icon: "other-expense",
    color: "#607D8B",
  },
];

export const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log(
        "🌱 База даних категорій порожня. Додаємо стандартні категорії.",
      );
      await Category.insertMany(defaultCategories);
      console.log("✅ Категорії успішно додані до бази даних.");
    } else {
      console.log(
        "ℹ️ Категорії вже існують у базі даних. Пропускаємо додавання.",
      );
    }
  } catch (error) {
    console.error("❌ Помилка при додаванні категорій до бази даних:", error);
  }
};
