import { ctrlWrapper } from "../helpers/index.js";
import { getCurrencyRate } from "../services/currency.js";

const getExchangeRate = async (req, res) => {
  const cachedRates = await getCurrencyRate();
  res.json(cachedRates);
};

export default {
  getExchangeRate: ctrlWrapper(getExchangeRate),
};
