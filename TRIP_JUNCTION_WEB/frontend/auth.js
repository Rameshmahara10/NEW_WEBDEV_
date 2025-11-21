// frontend/auth.js

// base URL: when developing locally backend runs at http://localhost:5000
const API_BASE = ''; // empty means same origin if you serve frontend via express
// If running backend separately: const API_BASE = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await signupUser();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await loginUser();
    });
  }
});

// helper: show bootstrap modal programmatically
function hideModal(modalId) {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}

// SIGNUP
async function signupUser() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');

    // store token (optional)
    localStorage.setItem('tj_token', data.token);
    localStorage.setItem('tj_user', JSON.stringify(data.user));

    alert('Account created successfully! You are logged in.');
    hideModal('signupModal');
    // optionally update UI to show logged-in user
  } catch (err) {
    alert(err.message);
    console.error('Signup error:', err);
  }
}

// LOGIN
async function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    // store token
    localStorage.setItem('tj_token', data.token);
    localStorage.setItem('tj_user', JSON.stringify(data.user));

    alert('Welcome back, ' + data.user.name + '!');
    hideModal('loginModal');
    // optionally update UI to show logged-in user
  } catch (err) {
    alert(err.message);
    console.error('Login error:', err);
  }
}
