import express from "express";
import ctrl from "../../controllers/categoriesController.js";
import { authenticate } from "../../middlewares/index.js";

const categoriesRouter = express.Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Отримання всіх категорій
 *     operationId: getCategories
 *     description: Повертає список усіх доступних категорій для користувача.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Категорії успішно отримані.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Категорії успішно отримані
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 64b17b42d28c40001ca4d28b
 *                           name:
 *                             type: string
 *                             example: Food
 *                           type:
 *                             type: string
 *                             enum: ["income", "expense"]
 *                             example: expense
 *                           icon:
 *                             type: string
 *                             example: food
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-10-01T12:00:00.000Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-10-01T12:00:00.000Z
 *       "401":
 *         description: Користувач не авторизований.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
categoriesRouter.get("/", authenticate, ctrl.getCategories);

/**
 * @openapi
 * /api/categories/statistics:
 *   get:
 *     summary: Отримання статистики за категоріями
 *     operationId: getCategoriesStatistics
 *     description: Повертає статистику витрат за місяць, загальні витрати та загальний дохід для поточного користувача.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Місяць для статистики у форматі JavaScript Date (0-11, де 0 = січень).
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Рік для статистики.
 *     responses:
 *       "200":
 *         description: Статистика категорій успішно отримана.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Статистика категорій успішно отримана
 *                 data:
 *                   type: object
 *                   properties:
 *                     expenseStatistics:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 64b17b42d28c40001ca4d28b
 *                           totalAmount:
 *                             type: number
 *                             description: Сума у доларах, обчислена як totalAmount / 100 з бази даних.
 *                             example: 250.00
 *                           name:
 *                             type: string
 *                             example: Food
 *                           icon:
 *                             type: string
 *                             example: food
 *                     totalExpense:
 *                       type: number
 *                       description: Загальні витрати за вибраний місяць у доларах.
 *                       example: 250.00
 *                     totalIncome:
 *                       type: number
 *                       description: Загальний дохід за вибраний місяць у доларах.
 *                       example: 1800.00
 *       "401":
 *         description: Користувач не авторизований.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
categoriesRouter.get("/statistics", authenticate, ctrl.getCategoriesStatistics);

export default categoriesRouter;
