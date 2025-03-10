import { useState } from "react";
import axios from "axios";
import "../styles/globals.css";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const currencies = [
    "USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "PKR"
  ];

  const currencySymbols = ["$", "€", "£", "₹", "A$", "C$", "¥", "₨"];

  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;

  const handleConvert = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!API_KEY) {
      alert("API key is missing! Add it to your .env.local file.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`;
      const response = await axios.get(endpoint);

      if (response.data.result === "success") {
        setConvertedAmount(response.data.conversion_result);
      } else {
        alert(`Error: ${response.data["error-type"]}`);
        setConvertedAmount(null);
      }
    } catch (error) {
      alert("An error occurred while fetching the conversion.");
      setConvertedAmount(null);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="container">
      {/* Animated Background Bubbles */}
      <div className="bubbles">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            data-currency={currencySymbols[i % currencySymbols.length]}
          ></span>
        ))}
      </div>

      {/* Main Converter */}
      <div className="converter">
        <h1 className="animated-heading">💱 My Currency Converter</h1>

        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            className="amount-input"
            placeholder="Enter amount"
          />

          <div className="currency-selectors">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="currency-select"
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>

            <button onClick={swapCurrencies} className="swap-button">
              🔄
            </button>

            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="currency-select"
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleConvert}
            disabled={loading}
            className="convert-button"
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>

        {convertedAmount !== null && (
          <h2 className="result">
            {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
          </h2>
        )}
      </div>

      {/* Signature + LinkedIn */}
      <div className="signature-wrapper">
        <div className="signature-content">
          <div className="signature-text">
            Made by <span>Bilal Waseem</span>
          </div>

          <a
            href="https://www.linkedin.com/in/bilal-waseem-b44006338"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-link"
          >
            <img
              src="/logo.webp"
              alt="LinkedIn Logo"
              className="linkedin-icon"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
