// src/pages/api/convert.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, fromCurrency, toCurrency } = req.body;

    const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Please enter a valid amount" });
    }

    if (!API_KEY) {
      return res.status(400).json({ error: "API key is missing! Add it in your code." });
    }

    try {
      const endpoint = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`;
      const response = await axios.get(endpoint);

      if (response.data.result === "success") {
        return res.status(200).json({ convertedAmount: response.data.conversion_result });
      } else {
        return res.status(400).json({ error: response.data["error-type"] });
      }
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ error: "An error occurred while fetching the conversion." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
