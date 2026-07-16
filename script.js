// ===========================================
// API CONFIGURATION
// ===========================================
const API_URL = "https://sw3n0y7nrd.execute-api.ap-south-1.amazonaws.com";

// ===========================================
// DOM ELEMENTS
// ===========================================
const expenseForm = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");
const totalAmount = document.getElementById("totalAmount");
const totalCount = document.getElementById("totalCount");
const expensiveTitle = document.getElementById("expensiveTitle");
const expensiveAmount = document.getElementById("expensiveAmount");
const categoryList = document.getElementById("categoryList");
const loader = document.getElementById("loader");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");

const CATEGORY_COLORS = {
  food: "#16A34A",
  travel: "#2563EB",
  shopping: "#9333EA",
  health: "#DC2626",
  education: "#EA580C",
  entertainment: "#DB2777",
  bills: "#0891B2",
  other: "#64748B"
};

let allExpenses = [];

// ===========================================
// LOADER
// ===========================================
function showLoader() { loader.classList.add("show"); }
function hideLoader() { loader.classList.remove("show"); }

// ===========================================
// TOAST
// ===========================================
function showToast(message, type = "success") {
  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-exclamation",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info"
  };
  toast.className = "toast";
  toast.classList.add(type);
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span>`;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ===========================================
// ANIMATED NUMBER COUNTER
// ===========================================
function animateNumber(el, to, prefix = "₹", decimals = 2) {
  const from = parseFloat((el.dataset.raw || "0"));
  el.dataset.raw = to;
  const dur = 700, start = performance.now();
  function step(t) {
    const p = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = from + (to - from) * eased;
    el.textContent = prefix + val.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ===========================================
// ESCAPE HTML
// ===========================================
function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

// ===========================================
// ADD EXPENSE
// ===========================================
expenseForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const amount = document.getElementById("amount").value;

  showLoader();
  try {
    const response = await fetch(`${API_URL}/addExpense`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, amount: Number(amount) })
    });
    const data = await response.json();
    hideLoader();

    if (response.ok) {
      showToast("Expense added successfully");
      expenseForm.reset();
      refreshDashboard();
    } else {
      showToast(data.message || "Unable to add expense", "error");
    }
  } catch (err) {
    hideLoader();
    console.error(err);
    showToast("Server error", "error");
  }
});

// ===========================================
// LOAD EXPENSES
// ===========================================
async function loadExpenses() {
  try {
    const response = await fetch(`${API_URL}/getExpense`);
    const data = await response.json();
    allExpenses = data.expenses || [];
    applySearchFilter();
  } catch (err) {
    console.error(err);
    showToast("Unable to fetch expenses", "error");
  }
}

// ===========================================
// RENDER TABLE
// ===========================================
function renderExpenses(expenses) {
  expenseTable.innerHTML = "";

  if (!expenses || expenses.length === 0) {
    expenseTable.innerHTML = `
      <tr>
        <td colspan="5" class="no-data">
          <i class="fa-solid fa-receipt"></i>
          No expenses found
        </td>
      </tr>
    `;
    return;
  }

  expenses.forEach(expense => {
    const categoryClass = expense.category ? expense.category.toLowerCase() : "other";

    expenseTable.innerHTML += `
      <tr>
        <td class="title-cell">${escapeHTML(expense.title)}</td>
        <td><span class="badge ${categoryClass}">${escapeHTML(expense.category)}</span></td>
        <td class="amount-cell">₹${Number(expense.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        <td class="date-cell">${formatDate(expense.date)}</td>
        <td>
          <button class="delete-btn" onclick="deleteExpense('${expense.expenseId}')" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// ===========================================
// SEARCH FUNCTIONALITY
// ===========================================
function applySearchFilter() {
  const term = (searchInput && searchInput.value || "").toLowerCase().trim();
  if (!term) {
    renderExpenses(allExpenses);
    return;
  }
  const filtered = allExpenses.filter(expense => {
    const title = (expense.title || "").toLowerCase();
    const category = (expense.category || "").toLowerCase();
    const amount = String(expense.amount || "");
    return title.includes(term) || category.includes(term) || amount.includes(term);
  });
  renderExpenses(filtered);
}
if (searchInput) {
  searchInput.addEventListener("input", applySearchFilter);
}

// ===========================================
// DELETE EXPENSE
// ===========================================
async function deleteExpense(expenseId) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  showLoader();
  try {
    const response = await fetch(`${API_URL}/deleteExpenses/${expenseId}`, { method: "DELETE" });
    const data = await response.json();
    hideLoader();

    if (response.ok) {
      showToast("Expense deleted successfully");
      refreshDashboard();
    } else {
      showToast(data.message || "Unable to delete expense", "error");
    }
  } catch (err) {
    hideLoader();
    console.error(err);
    showToast("Server error", "error");
  }
}

// ===========================================
// LOAD TOTAL SPENDING
// ===========================================
async function loadTotal() {
  try {
    const response = await fetch(`${API_URL}/total`);
    const data = await response.json();
    animateNumber(totalAmount, Number(data.total ?? 0));
    totalCount.textContent = `${allExpenses.length} expense${allExpenses.length === 1 ? "" : "s"}`;
  } catch (err) {
    console.error(err);
  }
}

// ===========================================
// LOAD MOST EXPENSIVE EXPENSE
// ===========================================
async function loadMostExpensive() {
  try {
    const response = await fetch(`${API_URL}/mostExpensive`);
    const data = await response.json();

    if (data.message) {
      expensiveTitle.textContent = "No expense yet";
      expensiveAmount.textContent = "₹0";
    } else {
      expensiveTitle.textContent = data.title;
      expensiveAmount.textContent = `₹${Number(data.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    }
  } catch (err) {
    console.error(err);
  }
}

// ===========================================
// LOAD CATEGORY REPORT
// ===========================================
async function loadCategoryReport() {
  try {
    const response = await fetch(`${API_URL}/categoryReport`);
    const data = await response.json();
    categoryList.innerHTML = "";

    const categories = Object.keys(data);
    if (categories.length === 0) {
      categoryList.innerHTML = `<p class="empty-text">No category data yet</p>`;
      return;
    }

    const maxVal = Math.max(...categories.map(c => Number(data[c]) || 0));

    categories
      .sort((a, b) => (Number(data[b]) || 0) - (Number(data[a]) || 0))
      .forEach(category => {
        const val = Number(data[category]) || 0;
        const pct = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0;
        const color = CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.other;

        const row = document.createElement("div");
        row.className = "category-item";
        row.innerHTML = `
          <div class="cat-top">
            <span class="cat-name"><span class="cat-dot" style="background:${color}"></span>${escapeHTML(category)}</span>
            <span class="cat-amount">₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="background:${color}"></div></div>
        `;
        categoryList.appendChild(row);
        requestAnimationFrame(() => {
          row.querySelector(".bar-fill").style.width = pct + "%";
        });
      });
  } catch (err) {
    console.error(err);
  }
}

// ===========================================
// EXPORT CSV
// ===========================================
document.getElementById("exportBtn").addEventListener("click", async () => {
  showLoader();
  try {
    const response = await fetch(`${API_URL}/export`);
    const data = await response.json();
    hideLoader();

    if (response.ok) {
      showToast("CSV exported successfully");
      console.log("Generated File:", data.file);
      alert("CSV generated successfully!\n\nS3 File:\n" + data.file);
    } else {
      showToast(data.message || "Export failed", "error");
    }
  } catch (err) {
    hideLoader();
    console.error(err);
    showToast("Server error", "error");
  }
});

// ===========================================
// REFRESH DASHBOARD
// ===========================================
async function refreshDashboard() {
  await loadExpenses();
  await loadTotal();
  await loadMostExpensive();
  await loadCategoryReport();
}

// ===========================================
// AUTO REFRESH EVERY 60 SECONDS
// ===========================================
setInterval(() => { refreshDashboard(); }, 60000);

// ===========================================
// PAGE LOAD
// ===========================================
window.addEventListener("DOMContentLoaded", () => {
  refreshDashboard();
});

// ===========================================
// ONLINE / OFFLINE STATUS
// ===========================================
window.addEventListener("offline", () => {
  showToast("No internet connection", "error");
  const status = document.getElementById("connStatus");
  if (status) status.innerHTML = `<span class="pip" style="background:#EF4444"></span>Offline`;
});
window.addEventListener("online", () => {
  showToast("Connection restored", "success");
  const status = document.getElementById("connStatus");
  if (status) status.innerHTML = `<span class="pip"></span>Live`;
});

// ===========================================
// CONSOLE MESSAGE
// ===========================================
console.log("%cFinTrack Expense Tracker Loaded 🚀", "font-size:16px;font-weight:bold;color:#3DDC84;");