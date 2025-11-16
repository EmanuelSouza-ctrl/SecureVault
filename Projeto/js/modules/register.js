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
        const name = form.elements['name'].value;
        const email = form.elements['email'].value;
        const password = form.elements['password'].value;
        const confirmPassword = form.elements['confirm-password'].value;
        const users = getRegisteredUsers();
        if (password !== confirmPassword) {
            feedback.textContent = "Erro: As senhas não coincidem.";
            feedback.style.color = 'red';
            return;
        }
        if (users.some(user => user.email === email)) {
            feedback.textContent = "Erro: Este e-mail já está cadastrado. Tente fazer login.";
            feedback.style.color = 'red';
            return;
        }
        const newUser = {
            name: name,
            email: email,
            password: password 
        };
        users.push(newUser);
        saveRegisteredUsers(users);
        feedback.textContent = "Cadastro simulado com sucesso! Seus dados foram salvos no seu navegador.";
        feedback.style.color = 'var(--color-accent)';
        form.reset();
        console.log("Novo Usuário Cadastrado:", newUser);
    });
}