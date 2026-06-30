let cachedRates = null;
let lastFetchTime = 0;

// ISO коди: 840 = USD, 978 = EUR, 985 = PLN, 980 = UAH
const ALLOWED_CODES = [840, 978, 985];
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 години

const getCurrencyRate = async () => {
  const now = Date.now();
  if (!cachedRates || now - lastFetchTime > CACHE_DURATION) {
    try {
      const response = await fetch("https://api.monobank.ua/bank/currency");
      if (response.status === 429 && cachedRates) {
        console.warn("Monobank API 429 Rate Limit. Використовуємо старий кеш");
        return cachedRates;
      }

      if (!response.ok) throw new Error("Помилка запиту до Monobank");

      const data = await response.json();

      const filteredRates = data
        .filter(
          (item) =>
            ALLOWED_CODES.includes(item.currencyCodeA) &&
            item.currencyCodeB === 980,
        )
        .map((item) => {
          let codeName = "";
          if (item.currencyCodeA === 840) codeName = "USD";
          if (item.currencyCodeA === 978) codeName = "EUR";
          if (item.currencyCodeA === 985) codeName = "PLN";
          return {
            currencyName: codeName,
            buy: item.rateBuy
              ? item.rateBuy.toFixed(2)
              : (item.rateCross * 0.995).toFixed(2),
            sell: item.rateSell
              ? item.rateSell.toFixed(2)
              : (item.rateCross * 1.005).toFixed(2),
          };
        });

      cachedRates = filteredRates;
      lastFetchTime = Date.now();
    } catch (error) {
      if (cachedRates) return cachedRates;
      throw error;
    }
  }
  return cachedRates;
};

export { getCurrencyRate };
