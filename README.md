#  SecureVault – Cofre Digital Seguro

**SecureVault** é um SaaS completo de armazenamento em nuvem, desenvolvido do zero, com **autenticação real**, **upload de arquivos no servidor**, **controle de planos**, **limite de armazenamento** e **dashboard protegido**.

Todo o sistema foi construído com **Vanilla JS no front-end** e **Node.js + Express no back-end**, sem dependência de serviços prontos como Firebase.

>  Projeto ideal para portfólio full stack, demonstrando domínio real de autenticação, API REST, upload de arquivos e organização de código.

---

##  Principais Destaques

*  Sem Firebase Authentication ou Storage
*  Autenticação segura com JWT
*  Upload, download e exclusão de arquivos reais no servidor
*  Controle de planos e limite de armazenamento
*  Estrutura pronta para escalar com **Prisma**
*  Tema dark/light com detecção automática
*  Totalmente responsivo

---

##  Funcionalidades (JÁ IMPLEMENTADAS)

* Cadastro, login e logout com JWT
* Rotas protegidas (dashboard só acessa com token válido)
* Upload de arquivos com nome único
* Listagem, download e exclusão de arquivos
* Barra de uso de armazenamento em tempo real
* Sistema de planos (free / premium / etc)
* Página de preços com toggle mensal/anual
* Página de perfil do usuário
* Logs e notificações no dashboard
* Tema claro/escuro com persistência
* Formulário de contato com EmailJS
* Reset de senha (fluxo preparado no front-end)

---

##  Tecnologias Utilizadas

| Camada       | Tecnologia                      | Uso                                 |
| ------------ | ------------------------------- | ----------------------------------- |
| Front-end    | HTML5, CSS3, Vanilla JavaScript | Interface completa + ES Modules     |
| Back-end     | Node.js + Express               | API REST                            |
| Auth         | JSON Web Tokens (JWT)           | Autenticação segura                 |
| Upload       | Multer + disco local            | Upload real de arquivos             |
| Banco        | Prisma ORM (schema pronto)      | Estrutura profissional de dados     |
| Persistência | JSON / Prisma                   | Fácil migração para SQLite/Postgres |
| Contato      | EmailJS                         | Envio de e-mails                    |
| Ícones       | Font Awesome 6                  | UI moderna                          |

---

##  Como Rodar Localmente

###  Clone o projeto

```bash
git clone https://github.com/seu-usuario/securevault.git
cd securevault
```

###  No Terminal 1, Instale as dependências do back-end

```bash
cd Projeto/backend
npm install
npx prisma migrate dev --name init
npx prisma generate
```

###  Inicie o servidor

```bash
npm server.js
```

###  No Terminal 2, Inicie o servidor do front-end

```bash
cd Projeto/frontend
npx serve
```

 Acesse a porta indicada no terminal (geralmente `http://localhost:38029`).

---

##  Estrutura do Projeto

```bash
Projeto/
├── frontend/
│   ├── index.html
│   ├── entrar.html
│   ├── cadastro.html
│   ├── dashboard.html
│   ├── perfil.html
│   ├── precos.html
│   ├── suporte.html
│   ├── reset-senha.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       └── modules/
│           ├── api.js
│           ├── auth.js
│           ├── files.js
│           ├── plans.js
│           ├── profile.js
│           ├── logs.js
│           ├── notifications.js
│           ├── theme-switcher.js
│           ├── pricing-toggle.js
│           └── contact-form.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── files.js
│   │   ├── plans.js
│   │   └── user.js
│   ├── schema.prisma
│   ├── uploads/
│   ├── package.json
│   └── package-lock.json
│
├── LICENSE
└── README.md
```

---

##  Próximos Passos (Planejados)

*  Integração com Stripe
*  Upgrade/downgrade de plano pelo dashboard
*  Compartilhamento de arquivos com link temporário
*  Histórico de downloads
*  PWA com notificações push
*  Migração definitiva para SQLite ou PostgreSQL

---

##  Licença

Sinta-se livre para **usar, modificar e publicar no seu portfólio**.

Feito com 💙 por **Emanuel Correia**
Fevereiro • 2026
