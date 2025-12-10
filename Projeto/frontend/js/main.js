// js/main.js
import initializeTheme, { toggleTheme } from './modules/theme-switcher.js';
import { setupPricingToggle } from './modules/pricing-toggle.js';
import { setupContactForm } from './modules/contact-form.js';
import { isLoggedIn } from './auth.js';

initializeTheme();

document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
document.getElementById('nav-toggle')?.addEventListener('click', () => {
  document.getElementById('nav-menu').classList.toggle('active');
  document.getElementById('nav-toggle').classList.toggle('active');
});

// Proteção de rota
if (window.location.pathname.includes('dashboard.html') && !isLoggedIn()) {
  window.location.href = 'entrar.html';
}

if (window.location.pathname.includes('precos.html')) setupPricingToggle();
if (window.location.pathname.includes('suporte.html')) setupContactForm();