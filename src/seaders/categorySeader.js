import { Category } from "../models/category.js";

const defaultCategories = [
  { name: "Зарплата", type: "income", icon: "salary" },
  { name: "Подарунки", type: "income", icon: "gift" },
  { name: "Фріланс", type: "income", icon: "freelance" },
  {
    name: "Інші доходи",
    type: "income",
    icon: "other-income",
  },
  { name: "Продукти", type: "expense", icon: "groceries" },
  {
    name: "Транспорт",
    type: "expense",
    icon: "transportation",
  },
  {
    name: "Дозвілля",
    type: "expense",
    icon: "entertainment",
  },
  {
    name: "Комунальні послуги",
    type: "expense",
    icon: "utilities",
  },
  { name: "Здоров'я", type: "expense", icon: "health" },
  { name: "Освіта", type: "expense", icon: "education" },
  {
    name: "Товари для дому",
    type: "expense",
    icon: "home-goods",
  },
  {
    name: "Інші витрати",
    type: "expense",
    icon: "other-expense",
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
