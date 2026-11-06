import express from "express";
import ctrl from "../../controllers/transactionsController.js";
import { authenticate, validateBody } from "../../middlewares/index.js";
import { schemas } from "../../models/transaction.js";

const transactionsRouter = express.Router();

/**
 * @openapi
 * /api/transactions:
 *   post:
 *     summary: Додавання транзакції
 *     operationId: addTransaction
 *     description: Додає дохід або витрату, оновлює баланс користувача та повертає створену транзакцію.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - category
 *               - amount
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *                 description: Тип транзакції (дохід або витрата).
 *               category:
 *                 type: string
 *                 example: 64b17b42d28c40001ca4d28b
 *                 description: Ідентифікатор категорії транзакції.
 *               amount:
 *                 type: number
 *                 exclusiveMinimum: 0
 *                 example: 25.50
 *                 description: Сума транзакції у валюті користувача.
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-08-15T09:21:43.123Z
 *                 description: Дата та час транзакції у форматі ISO 8601.
 *               comment:
 *                 type: string
 *                 example: Покупки
 *                 description: Коментар до транзакції.
 *     responses:
 *       "201":
 *         description: Транзакцію успішно додано.
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
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Транзакція успішно додана
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 64b17b42d28c40001ca4d28b
 *                         userId:
 *                           type: string
 *                           example: 64b17b42d28c40001ca4d28c
 *                         type:
 *                           type: string
 *                           enum: [income, expense]
 *                         category:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 64b17b42d28c40001ca4d28b
 *                             name:
 *                               type: string
 *                               example: Groceries
 *                             type:
 *                               type: string
 *                               enum: [income, expense]
 *                             icon:
 *                               type: string
 *                               example: cart
 *                         amount:
 *                           type: number
 *                           example: 25.50
 *                         date:
 *                           type: string
 *                           format: date-time
 *                         comment:
 *                           type: string
 *                           example: Покупки
 *                         balanceAfter:
 *                           type: number
 *                           example: 1515.50
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                     totalBalance:
 *                       type: number
 *                       example: 2515.50
 *       "400":
 *         description: Недостатньо коштів або дані транзакції не пройшли перевірку.
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
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Недостатньо коштів для цієї транзакції
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
 *       "404":
 *         description: Користувача не знайдено.
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
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Користувача не знайдено
 */
transactionsRouter.post(
  "/",
  authenticate,
  validateBody(schemas.createTransactionSchema),
  ctrl.addTransaction,
);

/**
 * @openapi
 * /api/transactions:
 *   get:
 *     summary: Отримання транзакцій користувача
 *     operationId: getTransactions
 *     description: Повертає транзакції авторизованого користувача, відсортовані за датою від найновішої до найстарішої.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 9
 *           minimum: 1
 *         description: Кількість транзакцій на сторінці.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Номер сторінки.
 *     responses:
 *       "200":
 *         description: Транзакції успішно отримано.
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
 *                   example: Транзакції успішно отримані
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 64b17b42d28c40001ca4d28b
 *                           userId:
 *                             type: string
 *                             example: 64b17b42d28c40001ca4d28c
 *                           type:
 *                             type: string
 *                             enum: [income, expense]
 *                           category:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 64b17b42d28c40001ca4d28b
 *                               name:
 *                                 type: string
 *                                 example: Groceries
 *                               type:
 *                                 type: string
 *                                 enum: [income, expense]
 *                               icon:
 *                                 type: string
 *                                 example: cart
 *                           amount:
 *                             type: number
 *                             example: 25.50
 *                           date:
 *                             type: string
 *                             format: date-time
 *                           comment:
 *                             type: string
 *                             example: Покупки
 *                           balanceAfter:
 *                             type: number
 *                             example: 1515.50
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     currentPage:
 *                       type: integer
 *                       example: 1
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
transactionsRouter.get("/", authenticate, ctrl.getTransactions);

export default transactionsRouter;
