import express from "express";
import { authenticate } from "../../middlewares/index.js";
import ctrl from "../../controllers/currencyController.js";

const currencyRouter = express.Router();

/**
 * @openapi
 * /api/currency:
 *   get:
 *     summary: Отримання курсів валют
 *     operationId: getExchangeRate
 *     description: Повертає курси USD, EUR та PLN до UAH. Якщо сервіс Monobank тимчасово недоступний, повертаються збережені курси, якщо вони є.
 *     tags:
 *       - Currency
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Курси валют успішно отримані.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   currencyName:
 *                     type: string
 *                     enum: [USD, EUR, PLN]
 *                     example: USD
 *                   buy:
 *                     type: string
 *                     description: Курс купівлі до UAH, відформатований до двох знаків після коми.
 *                     example: "41.20"
 *                   sell:
 *                     type: string
 *                     description: Курс продажу до UAH, відформатований до двох знаків після коми.
 *                     example: "41.80"
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
currencyRouter.get("/", authenticate, ctrl.getExchangeRate);

export default currencyRouter;
