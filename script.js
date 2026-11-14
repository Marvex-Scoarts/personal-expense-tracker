// 1. GRAB HTML ELEMENTS
const balanceEl = document.getElementById("balance");
const moneyPlusEl = document.getElementById("money-plus");
const moneyMinusEl = document.getElementById("money-minus");
const listEl = document.getElementById("list");
const formEl = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const currencySelect = document.getElementById("currency-select");
const chartCanvas = document.getElementById("expense-chart");
const chartEmptyMsg = document.getElementById("chart-empty-msg");

// 2. LOAD SAVED DATA FROM LOCAL STORAGE
let transactions = JSON.parse(localStorage.getItem("fintech_transactions")) || [];
let currentCurrency = localStorage.getItem("fintech_currency") || "₦";
currencySelect.value = currentCurrency;

// Category colors for the spending donut chart
const categoryColors = {
  Food: "#f43f5e",      // Coral Red
  Transport: "#38bdf8", // Sky Blue
  Shopping: "#a855f7",  // Purple
  Bills: "#f59e0b",     // Amber
  Fun: "#ec4899",       // Pink
  Salary: "#10b981",    // Emerald
  Other: "#64748b"      // Slate
};

// 3. FORMAT MONEY WITH COMMAS & SELECTED CURRENCY
function formatMoney(num) {
  const formatted = Math.abs(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${currentCurrency}${formatted}`;
}

// 4. SWITCH CURRENCY LIVE
currencySelect.addEventListener("change", (e) => {
  currentCurrency = e.target.value;
  localStorage.setItem("fintech_currency", currentCurrency);
  init();
});

// 5. ADD NEW TRANSACTION
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const rawAmount = parseFloat(amountInput.value);
  if (textInput.value.trim() === "" || isNaN(rawAmount) || rawAmount <= 0) return;

  // Make expenses negative and income positive
  const signedAmount = typeInput.value === "expense" ? -Math.abs(rawAmount) : Math.abs(rawAmount);

  const transaction = {
    id: Date.now(),
    text: textInput.value.trim(),
    amount: signedAmount,
    category: categoryInput.value
  };

  transactions.push(transaction);
  saveAndRender();

  textInput.value = "";
  amountInput.value = "";
});

// 6. DELETE TRANSACTION
function removeTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  saveAndRender();
}

// 7. SAVE TO BROWSER STORAGE & REFRESH UI
function saveAndRender() {
  localStorage.setItem("fintech_transactions", JSON.stringify(transactions));
  init();
}

// 8. RENDER TRANSACTION LIST ITEMS
function addTransactionDOM(tx) {
  const isExpense = tx.amount < 0;
  const sign = isExpense ? "-" : "+";

  const item = document.createElement("li");
  item.classList.add(isExpense ? "minus" : "plus");

  item.innerHTML = `
    <div class="tx-info">
      <span class="tx-title">${tx.text}</span>
      <span class="tx-category">${tx.category}</span>
    </div>
    <div class="tx-right">
      <span class="tx-amount">${sign}${formatMoney(tx.amount)}</span>
      <button class="delete-btn" onclick="removeTransaction(${tx.id})" title="Delete">✕</button>
    </div>
  `;

  listEl.prepend(item); // Show newest transactions at the top
}

// 9. CALCULATE BALANCE, INCOME & EXPENSE TOTALS
function updateValues() {
  const amounts = transactions.map(tx => tx.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
  const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0);

  const balanceSign = total < 0 ? "-" : "";
  balanceEl.innerText = `${balanceSign}${formatMoney(total)}`;
  moneyPlusEl.innerText = `+${formatMoney(income)}`;
  moneyMinusEl.innerText = `-${formatMoney(expense)}`;
}

// 10. DRAW OFFLINE SPENDING DONUT CHART (HTML5 CANVAS)
function renderChart() {
  const ctx = chartCanvas.getContext("2d");
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

  // Filter only expenses and group by category
  const expenses = transactions.filter(tx => tx.amount < 0);

  if (expenses.length === 0) {
    chartCanvas.style.display = "none";
    chartEmptyMsg.style.display = "block";
    return;
  }

  chartCanvas.style.display = "block";
  chartEmptyMsg.style.display = "none";

  const categoryTotals = {};
  let totalSpent = 0;

  expenses.forEach(tx => {
    const absVal = Math.abs(tx.amount);
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + absVal;
    totalSpent += absVal;
  });

  // Draw Donut Slices on Left Side
  const centerX = 85;
  const centerY = 100;
  const radius = 70;
  let startAngle = -0.5 * Math.PI;

  const categories = Object.keys(categoryTotals);

  categories.forEach(cat => {
    const sliceAngle = (categoryTotals[cat] / totalSpent) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = categoryColors[cat] || "#6366f1";
    ctx.fill();
    startAngle += sliceAngle;
  });

  // To Cut out inner circle to make it a sleek Fintech Donut Chart
  ctx.beginPath();
  ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
  ctx.fillStyle = "#171a26";
  ctx.fill();

  // To Draw Legend on Right Side
  ctx.font = "12px Inter, Segoe UI, sans-serif";
  ctx.textBaseline = "middle";

  categories.forEach((cat, index) => {
    const legendX = 175;
    const legendY = 30 + index * 24;
    const percent = Math.round((categoryTotals[cat] / totalSpent) * 100);

    ctx.fillStyle = categoryColors[cat] || "#6366f1";
    ctx.fillRect(legendX, legendY - 6, 12, 12);

    ctx.fillStyle = "#f3f4f6";
    ctx.fillText(`${cat} (${percent}%)`, legendX + 18, legendY);
  });
}

// 11. INITIALIZE APP
function init() {
  listEl.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
  renderChart();
}

init();