// ===========================================================
// 🌿 Trip Junction — Main Script (Enhanced & Cleaned)
// ===========================================================



// ===========================================================
// ✅ Inquiry Form
// ===========================================================
document.getElementById('inquiry-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('confirmation-message');

  if (!name) return;

  message.textContent = `Thank you, ${name}! Your inquiry has been received. 🌴`;
  message.classList.remove('hidden');

  setTimeout(() => message.classList.add('hidden'), 5000);

  this.reset();
});



// ===========================================================
// ✅ Search Suggestions + Highlight
// ===========================================================
const placeNames = [
  'Goa', 'Kerala', 'Rajasthan', 'Ladakh',
  'Andaman', 'Golden Triangle', 'Sikkim', 'Hampi'
];

const inputBox = document.getElementById('searchInput');
const suggestBox = document.getElementById('suggestBox');
const noMsg = document.getElementById('noResultMessage');

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Reset Cards
function resetCards() {
  document.querySelectorAll('.grid .card').forEach(c =>
    c.classList.remove('highlight-card', 'dim-card')
  );
  if (noMsg) noMsg.style.display = 'none';
}

// Suggestions
const handleSuggestions = debounce(() => {
  const val = inputBox.value.toLowerCase().trim();
  suggestBox.innerHTML = '';

  if (!val) {
    suggestBox.style.display = 'none';
    resetCards();
    return;
  }

  const suggestions = placeNames.filter(p => p.toLowerCase().includes(val));

  if (suggestions.length === 0) {
    suggestBox.style.display = 'none';
    return;
  }

  suggestBox.style.display = 'block';
  suggestBox.classList.add('fade-in');

  suggestions.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('suggest-item');
    div.textContent = item;

    div.onclick = () => {
      inputBox.value = item;
      suggestBox.style.display = 'none';
      searchPlace();
    };

    suggestBox.appendChild(div);
  });
}, 250);

inputBox?.addEventListener('keyup', handleSuggestions);

// Hide box outside
document.addEventListener('click', e => {
  if (e.target !== inputBox && e.target.parentNode !== suggestBox)
    suggestBox.style.display = 'none';
});

// Search place
function searchPlace(event) {
  if (event) event.preventDefault();

  const raw = inputBox.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.grid .card');

  resetCards();
  if (!raw) return;

  let matchedCard = null;

  cards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    if (title.includes(raw)) matchedCard = card;
  });

  if (!matchedCard) {
    noMsg.style.display = 'block';
    showToast('❗ Place not found — try Goa, Kerala, or Ladakh.');
    return;
  }

  cards.forEach(card => {
    if (card !== matchedCard) card.classList.add('dim-card');
  });

  matchedCard.classList.add('highlight-card');
  matchedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Enter → search
document.getElementById('searchForm')?.addEventListener('submit', searchPlace);

// Clear search
inputBox?.addEventListener('input', function () {
  if (this.value.trim() === '') resetCards();
});

// Home click reset
document.querySelector('a[href="#"]')?.addEventListener('click', () => {
  resetCards();
  inputBox.value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});



// ===========================================================
// 🌟 Toast Message
// ===========================================================
function showToast(message) {
  let toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => toast.classList.remove('show'), 3000);
  setTimeout(() => toast.remove(), 3500);
}



// ===========================================================
// 🚀 AUTH SYSTEM
// ===========================================================
const BASE_URL = "http://localhost:5001/api/auth";

// Close Modal Helper
function closeModal(modalId) {
  const modalElement = document.getElementById(modalId);
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) modal.hide();
}



// ===========================================================
// 🔹 SIGNUP
// ===========================================================
async function signupUser() {
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

  if (!name || !email || !password) {
    showToast("⚠ All fields are required");
    return;
  }

  if (!email.includes("@")) {
    showToast("⚠ Enter a valid email");
    return;
  }

  if (password.length < 6) {
    showToast("⚠ Password must be at least 6 characters");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showToast("🎉 Account created!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      closeModal("signupModal");
      signupForm.reset();
      updateUIAfterLogin();
    } else {
      showToast(data.message);
    }
  } catch (err) {
    showToast("❌ Server error");
  }
}

signupForm?.addEventListener("submit", e => {
  e.preventDefault();
  signupUser();
});



// ===========================================================
// 🔹 LOGIN (FINAL)
// ===========================================================
async function loginUser() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    showToast("⚠ Email & password required");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showToast("🎉 Welcome back!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      closeModal("loginModal");
      loginForm.reset();
      updateUIAfterLogin();
    } else {
      showToast("❌ " + data.message);
    }
  } catch (err) {
    showToast("❌ Server error");
  }
}

loginForm?.addEventListener("submit", e => {
  e.preventDefault();
  loginUser();
});



// ===========================================================
// 👁️ Show/Hide Password (Login + Signup)
// ===========================================================
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", function () {
    const input = this.previousElementSibling;

    if (input.type === "password") {
      input.type = "text";
      this.classList.replace("bi-eye-slash", "bi-eye");
    } else {
      input.type = "password";
      this.classList.replace("bi-eye", "bi-eye-slash");
    }
  });
});



// ===========================================================
// 🔹 Update Navbar After Login
// ===========================================================
function updateUIAfterLogin() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  // Replace buttons with welcome text
  const buttonBox = document.querySelector(".mx-2");

  buttonBox.innerHTML = `
      <span class="me-2 fw-semibold text-success">Hello, ${user.name.split(" ")[0]} 👋</span>
      <button class="btn btn-outline-danger" onclick="logoutUser()">Logout</button>
  `;
}



// ===========================================================
// 🔹 Logout
// ===========================================================
function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  showToast("🔓 Logged out");

  setTimeout(() => location.reload(), 800);
}



// ===========================================================
// 🔹 Auto Update UI on Page Load
// ===========================================================
document.addEventListener("DOMContentLoaded", updateUIAfterLogin);
