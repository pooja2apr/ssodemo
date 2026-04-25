# 🔐 Multi SSO Demo (Okta + Azure AD)

This project demonstrates Single Sign-On (SSO) using:

- Okta (OIDC)
- Microsoft Entra ID (Azure AD)

Built using Node.js and OpenID Connect.

---

## 🚀 Features

- Secure SSO login
- Authorization Code Flow
- State validation (CSRF protection)
- Session-based authentication
- Multi-provider ready architecture

---

## ⚙️ Setup

1. Clone the repository

2. Install dependencies
npm install

3. Create a `.env` file

AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_secret
AZURE_TENANT_ID=your_tenant_id
BASE_URL=http://localhost:3000

4. Run the app
node app.js

---

## 🔐 Supported Identity Providers

- Okta
- Azure AD

---

## 📚 Learnings

- Implemented OpenID Connect flow
- Handled state validation securely
- Integrated multiple identity providers
- Debugged real-world SSO errors

---

## 👩‍💻 Author

Pooja Verma
