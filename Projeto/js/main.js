// js/main.js
import initializeTheme, { toggleTheme } from './modules/theme-switcher.js';
import { setupPricingToggle } from './modules/pricing-toggle.js';
import { setupContactForm } from './modules/contact-form.js'; 
import { setupRegisterForm } from './modules/register.js';
import { setupLoginForm } from './modules/login.js'; 
initializeTheme();
const themeButton = document.getElementById('theme-toggle-btn');
if (themeButton) {
    themeButton.addEventListener('click', toggleTheme);
}
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}
if (window.location.pathname.includes('dashboard.html')) {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'entrar.html';
    }
}
if (window.location.pathname.includes('precos.html')) setupPricingToggle();
if (window.location.pathname.includes('suporte.html')) setupContactForm();
if (window.location.pathname.includes('cadastro.html')) setupRegisterForm();
if (window.location.pathname.includes('entrar.html')) setupLoginForm();