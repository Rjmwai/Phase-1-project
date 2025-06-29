const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const resultDiv = document.getElementById("result");

// List of currencies
const currencies = ["CZK", "USD", "EUR", "CAD", "AUD", "GBP", "CHF"];

currencies.forEach(currency => {
  const option1 = document.createElement("option");
  option1.value = currency;
  option1.textContent = currency;
  fromSelect.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = currency;
  option2.textContent = currency;
  toSelect.appendChild(option2);
});

// Default values
fromSelect.value = "USD";
toSelect.value = "CZK";

async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    resultDiv.textContent = "Please enter a valid amount.";
    return;
  }

  try {
    // Fetching from your local JSON Server
    const response = await fetch("http://localhost:3000/rates");
    const data = await response.json();

    // Create a rates folder
    const rates = { "CZK": 1 }; // CZK is the base
    data.forEach(rate => {
      rates[rate.currency] = rate.rate / rate.amount;
    });

    // Ensure currencies exist in the fetched rates
    if (!(from in rates) || !(to in rates)) {
      resultDiv.textContent = "Currency not supported.";
      return;
    }

    // Convert from ...  to  ...
    const amountInCZK = amount * (1 / rates[from]);
    const convertedAmount = amountInCZK * rates[to];

    resultDiv.textContent = `${amount} ${from} = ${convertedAmount.toFixed(4)} ${to}`;
  } catch (error) {
    resultDiv.textContent = "Error fetching exchange rates.";
    console.error("Fetch error:", error);
  }
}
