// js/modules/login.js
const USERS_KEY = 'registeredUsers';

export function setupLoginForm() {
    const form = document.getElementById('login-form');
    const feedback = document.getElementById('form-feedback-login');
    if (!form || !feedback) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = form.elements['email'].value.trim();
        const password = form.elements['password'].value;

        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            feedback.textContent = `Login bem-sucedido! Redirecionando...`;
            feedback.style.color = 'var(--color-accent)';

            // Salva usuário logado na sessão
            sessionStorage.setItem('currentUser', email);

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1200);
        } else {
            feedback.textContent = 'E-mail ou senha incorretos.';
            feedback.style.color = 'red';
        }
    });
}