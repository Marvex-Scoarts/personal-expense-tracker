# Personal Fintech Expense Tracker

A sleek, minimal dark-mode expense tracker built to record daily income and expenses, calculate live balances, visualize category spending, and switch seamlessly across international currencies.

**Try the Live App Here:** `https://marvex-scoarts.github.io/personal-expense-tracker/`

---

## Features

- **Real-Time Balance & Cashflow Summary:** Automatically calculates total balance, total income, and total expenses as you add or delete transactions.
- **Multi-Currency Switcher:** Instantly toggle between **NGN (₦)**, **GHS (₵)**, **XOF (CFA)**, **USD ($)**, and **GBP (£)** for friends across Nigeria, Ghana, Togo, the US, and the UK.
- **Interactive Spending Donut Chart:** Built from scratch using HTML5 Canvas to visualize expense percentages across categories (*Food, Transport, Shopping, Bills, Fun, Salary, Other*) with zero external chart libraries.
- **Automatic Local Storage:** Saves all transactions and your preferred currency directly in the browser so your data stays private and persists after refreshing.
- **Clean Fintech Dark Mode UI:** Minimalist obsidian surfaces, razor-thin borders, and crisp emerald and coral accents.

---

##  Built With

- **HTML5** – Semantic layout, transaction forms, and HTML5 `<canvas>`
- **CSS3** – Minimal fintech dark-mode design, CSS Grid cards, and responsive styling
- **Vanilla JavaScript (ES6)** – State management, array math (`reduce`, `filter`), `localStorage` persistence, and custom Canvas donut chart rendering

---

## How to Use

1. Open the live web app on your phone or computer.
2. Select your preferred currency (**₦, ₵, CFA, $, £**) from the top-right dropdown.
3. Enter a **Description**, **Amount**, **Type** (*Income* or *Expense*), and **Category**, then click **Add Transaction**.
4. Watch your balance update, view your spending breakdown on the donut chart, and delete any entry anytime with one click.

---

## Run Locally on Your Computer

1. Download or clone this repository.
2. Open the `expense-tracker` folder.
3. Double-click `index.html` to run the app in any web browser—works completely offline!
