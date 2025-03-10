import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/globals.css";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([
    "USD",
    "EUR",
    "GBP",
    "INR",
    "AUD",
    "CAD",
    "JPY",
  ]);

  const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API Key

  const handleConvert = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!API_KEY) {
      alert("API key is missing! Add it in your code.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`;

      const response = await axios.get(endpoint);

      if (response.data.result === "success") {
        setConvertedAmount(response.data.conversion_result);
      } else {
        console.error("Conversion Error:", response.data["error-type"]);
        alert(`Error: ${response.data["error-type"]}`);
        setConvertedAmount(null);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("An error occurred while fetching the conversion.");
      setConvertedAmount(null);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="container">
      <div className="bubbles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="converter">
        <h1>💱 Currency Converter</h1>

        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
          />

          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <button type="button" onClick={swapCurrencies} style={{ margin: "0 0.5rem" }}>
            🔄
          </button>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <button type="button" onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>

        {convertedAmount !== null && (
          <h2>
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </h2>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
