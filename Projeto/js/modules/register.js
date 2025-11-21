const USERS_KEY = 'registeredUsers';
function getRegisteredUsers() {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}
function saveRegisteredUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
export function setupRegisterForm() {
    const form = document.getElementById('register-form'); 
    const feedback = document.getElementById('form-feedback-register');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const password = form.elements['password'].value;
        const confirmPassword = form.elements['confirm-password'].value;

        if (password !== confirmPassword) {
            feedback.textContent = "As senhas não coincidem.";
            feedback.style.color = 'red';
            return;
        }

        const users = getRegisteredUsers();
        if (users.some(user => user.email === email)) {
            feedback.textContent = "Este e-mail já está cadastrado.";
            feedback.style.color = 'red';
            return;
        }

        const newUser = {
            name,
            email,
            password,
            plano: 'Básico',
            dataCadastro: new Date().toISOString()
        };

        users.push(newUser);
        saveRegisteredUsers(users);

        feedback.textContent = "Cadastro concluído! Bem-vindo ao plano Básico.";
        feedback.style.color = 'var(--color-accent)';
        setTimeout(() => {
            window.location.href = 'entrar.html';
        }, 1500);
    });
}