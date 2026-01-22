import { initializeTheme, toggleTheme } from './modules/theme-switcher.js';
import { isLoggedIn, logout } from './modules/auth.js';
import { setupPricingToggle } from './modules/pricing-toggle.js';
import { setupContactForm } from './modules/contact-form.js';

// Dark mode
initializeTheme();

document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
document.getElementById('darkToggle')?.addEventListener('click', toggleTheme);

// Proteção de rotas
const protectedPages = ['dashboard.html', 'perfil.html'];
if (protectedPages.some(page => location.pathname.includes(page)) && !isLoggedIn()) {
  location.href = 'entrar.html';
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', logout);

// Preços
if (location.pathname.includes('precos.html')) {
  setupPricingToggle();
}

// Suporte
if (location.pathname.includes('suporte.html')) {
  setupContactForm();
}

// Menu mobile
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('show'));
}