const SERVICE_ID = 'service_j1fo70c'; 
const TEMPLATE_ID = 'template_kai0oa8';
const PUBLIC_KEY = 'eheEMM40Z7ZyaApD2'; 

emailjs.init({
    publicKey: PUBLIC_KEY,
});

export function setupContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        feedback.textContent = "Enviando mensagem...";
        feedback.style.color = 'var(--color-primary)';
        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
            .then(
                () => {
                    feedback.textContent = "Mensagem enviada com sucesso! Em breve entraremos em contato.";
                    feedback.style.color = 'var(--color-accent)';
                    form.reset(); 
                },
                (error) => {
                    console.error('Falha ao enviar e-mail:', error);
                    feedback.textContent = "Erro ao enviar mensagem. Tente novamente mais tarde.";
                    feedback.style.color = 'red';
                }
            )
            .finally(() => {
                submitButton.disabled = false;
            });
    });
}