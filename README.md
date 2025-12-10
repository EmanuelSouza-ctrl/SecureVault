# SecureVault – Cofre Digital Seguro

**SecureVault** é um SaaS completo de armazenamento em nuvem com autenticação real, upload de arquivos no servidor, controle de planos e limite de armazenamento — tudo feito com **Vanilla JS no front-end** e **Node.js + Express no back-end**.

- Sem Firebase Authentication ou Storage (tudo substituído por back-end próprio)
- Autenticação com JWT
- Upload/download/exclusão de arquivos salvos no servidor
- Banco de dados persistente em JSON (pronto para evoluir para Prisma/SQLite)
- Totalmente responsivo + tema dark/light + toggle de preços

## Funcionalidades (TODAS JÁ FUNCIONANDO)

- Cadastro e login com JWT real
- Dashboard protegido (só entra com token válido)
- Upload de arquivos com nome único
- Listagem, download e exclusão de arquivos
- Barra de armazenamento em tempo real
- Tema claro/escuro com detecção automática
- Formulário de contato com EmailJS

## Tecnologias Utilizadas

| Camada      | Tecnologia                         | Uso                                      |
|-------------|------------------------------------|------------------------------------------|
| Front-end   | HTML5, CSS3, Vanilla JavaScript    | Interface completa + módulos ES6         |
| Back-end    | Node.js + Express                  | API REST completa                        |
| Auth        | JSON Web Tokens (JWT)              | Autenticação segura                      |
| Upload      | Multer + disco local               | Armazenamento real de arquivos           |
| Banco       | JSON (users.json)                  | Persistência simples (fácil de migrar)   |
| Contato     | EmailJS                            | Envio de e-mails sem back-end            |
| Ícones      | Font Awesome 6                     | UI moderna                               |

## Como Rodar Localmente
```Bash
# 1. Clone ou baixe o projeto
git clone https://github.com/seu-usuario/securevault.git
cd securevault
# 2. Abra com Live Server (VS Code) ou:
npx live-server
# ou, se tiver o package.json que eu te dei:
npm install
npm start
Abra http://localhost:3000 (ou a porta que aparecer) e pronto!
```

## Estrutura do Projeto

```bash
securevault/
├── frontend/
│   ├── index.html, entrar.html, cadastro.html, dashboard.html, etc
│   ├── style.css
│   └── js/
│       ├── main.js
│       └── modules/
│           ├── theme-switcher.js
│           ├── contact-form.js
│           ├── pricing-toggle.js
│           ├── auth.js
│           └── api.js
│
├── backend/
│   ├── server.js              # API Express completa
│   ├── package.json
│   ├── db/
│   │   └── users.json         # Banco de dados (criado automaticamente)
│   └── uploads/               # Arquivos enviados pelos usuários
│
├── README.md
└── .gitignore
```

## Próximos Passos (já planejados)

 Sistema de pagamento com Stripe
 Upgrade de plano dentro do dashboard
 Compartilhamento de arquivos com link temporário
 PWA + notificações

 ## Licença
 
Sinta-se à vontade para usar, modificar e colocar no portfólio.
Feito com carinho por **Emanuel Correia**
Novembro 2025
Qualquer dúvida é só chamar!
