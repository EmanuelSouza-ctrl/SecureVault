# SecureVault – Cofre Digital Seguro

**SecureVault** é um cofre digital moderno com criptografia de ponta a ponta, armazenamento em nuvem real (Firebase), autenticação local, tema dark/light, página de preços com toggle anual/mensal e design totalmente responsivo.  
Projeto com Vanilla JS + HTML + CSS + Firebase Storage.

Site ao vivo (se você fizer deploy no Firebase Hosting):  
https://securevault-7ac1e.web.app (ou o seu link)

## Funcionalidades Principais

- Cadastro e login (localStorage + sessionStorage)
- Dashboard protegido com nome do usuário e plano
- Upload/download/exclusão de arquivos com criptografia AES no navegador
- Armazenamento real no Firebase Storage (nuvem verdadeira)
- Limite de armazenamento por plano
- Página de preços com toggle Mensal/Anual animado
- Tema claro/escuro automático + botão de troca
- Formulário de contato funcional (EmailJS)
- Totalmente responsivo (mobile, tablet, desktop)

## Tecnologias Utilizadas

| Tecnologia              | Uso                                 |
|-------------------------|-------------------------------------|
| HTML5 + CSS3 + Vanilla JS | Estrutura, estilo e lógica completa |
| Firebase Storage        | Armazenamento em nuvem real         |
| CryptoJS                | Criptografia AES-256 client-side        |
| EmailJS                 | Envio de e-mails sem backend        |
| Font Awesome 6          | Ícones                              |
| localStorage / sessionStorage | Autenticação simulada          |

## Como Rodar Localmente

```bash
# 1. Clone ou baixe o projeto
git clone https://github.com/seu-usuario/securevault.git
cd securevault

# 2. Abra com Live Server (VS Code) ou:
npx live-server

# ou, se tiver o package.json que eu te dei:
npm install
npm start
```

Abra http://localhost:3000 (ou a porta que aparecer) e pronto!

## Estrutura de Pastas

```
securevault/
├── index.html
├── entrar.html
├── cadastro.html
├── dashboard.html
├── precos.html
├── funcionalidades.html
├── suporte.html
├── style.css
├── js/
│   ├── main.js
│   └── modules/
│       ├── theme-switcher.js
│       ├── login.js
│       ├── register.js
│       ├── contact-form.js
│       └── pricing-toggle.js
└── README.md
```

## Próximos Passos (Em planejamento para o futuro)

- [ ] Trocar autenticação simulada por Firebase Authentication real
- [ ] Sistema de pagamento com Stripe (plano simulado)
- [ ] Compartilhamento de arquivos com link temporário
- [ ] Deploy automático com Firebase Hosting + GitHub Actions
- [ ] PWA (instalável no celular)

## Licença

 Sinta-se à vontade para usar, modificar e colocar no portfólio.

Feito com carinho por **Emanuel Augusto**  
Novembro 2025

Qualquer dúvida é só chamar! 
