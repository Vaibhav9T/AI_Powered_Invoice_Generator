# AI-Powered Invoice Generator

[![version](frontend/invoice-generator/package.json)](frontend/invoice-generator/package.json) <!-- badge placeholder -->
[![vite](frontend/invoice-generator/vite.config.js)](frontend/invoice-generator/vite.config.js)

A minimal React + Vite frontend for an AI-powered invoice generator. This repository contains a frontend scaffold (React + Vite + Tailwind) and a placeholder backend directory for server/API code.

Why this project exists
- Provides a quick, extendable starting point for building an invoice generator UI with modern tools (React 19, Vite, Tailwind).
- Organizes common invoice-related pages and components (dashboard, invoices, auth) so you can focus on business logic and AI integration.

Key features and benefits
- Lightweight Vite dev experience ([vite.config.js](frontend/invoice-generator/vite.config.js))
- Tailwind-ready styling ([src/index.css](frontend/invoice-generator/src/index.css))
- Route-based layout and protected routes example via [`ProtectedRoute`](frontend/invoice-generator/src/components/auth/ProtectedRoute.jsx)
- Example pages for quick UI iteration:
  - [`LandingPage`](frontend/invoice-generator/src/pages/LandingPage/LandingPage.jsx)
  - [`Login`](frontend/invoice-generator/src/pages/auth/Login.jsx)
  - [`Signup`](frontend/invoice-generator/src/pages/auth/Signup.jsx)
  - [`Dashboard`](frontend/invoice-generator/src/pages/Dashboard/Dashboard.jsx)
  - [`AllInvoices`](frontend/invoice-generator/src/pages/Invoices/AllInvoices.jsx)
  - [`CreateInvoice`](frontend/invoice-generator/src/pages/Invoices/CreateInvoice.jsx)
  - [`InvoiceDetails`](frontend/invoice-generator/src/pages/Invoices/InvoiceDetails.jsx)
  - [`ProfilePage`](frontend/invoice-generator/src/pages/Profile/ProfilePage.jsx)

Getting started (frontend)
1. Prerequisites
   - Node.js (v18+ recommended)
   - npm or yarn

2. Install dependencies
```sh
# from project root or frontend/invoice-generator
cd frontend/invoice-generator
npm install
```

3. Run the dev server
```sh
npm run dev
```
Open http://localhost:5173 (Vite default) — the app entry is [`src/main.jsx`](frontend/invoice-generator/src/main.jsx) which mounts [`App`](frontend/invoice-generator/src/App.jsx).

Build and preview
```sh
npm run build
npm run preview
```

Project structure (frontend)
- [`frontend/invoice-generator/package.json`](frontend/invoice-generator/package.json) — deps & scripts
- [`frontend/invoice-generator/vite.config.js`](frontend/invoice-generator/vite.config.js) — Vite + React + Tailwind plugin
- [`frontend/invoice-generator/src/index.css`](frontend/invoice-generator/src/index.css) — base styles
- [`frontend/invoice-generator/src/App.jsx`](frontend/invoice-generator/src/App.jsx) — routes and app wiring
- [`frontend/invoice-generator/src/main.jsx`](frontend/invoice-generator/src/main.jsx) — mount point
- Components:
  - [`ProtectedRoute`](frontend/invoice-generator/src/components/auth/ProtectedRoute.jsx)
  - [`DashboardLayout`](frontend/invoice-generator/src/components/layout/DashboardLayout.jsx)
- Context:
  - [`AuthContext`](frontend/invoice-generator/src/context/AuthContext.jsx)
- Pages: see links above

Notes & quick tips
- The current [`ProtectedRoute`](frontend/invoice-generator/src/components/auth/ProtectedRoute.jsx) is a small example; adapt auth logic and imports (e.g., `DashboardLayout`, `memo`) to your needs.
- Tailwind is configured as a plugin in Vite ([vite.config.js](frontend/invoice-generator/vite.config.js)) — update Tailwind config if you add Tailwind features.
- The frontend README at [`frontend/invoice-generator/README.md`](frontend/invoice-generator/README.md) contains Vite template notes.

Where to get help
- Open an issue in this repository.
- Inspect files linked in this README for component examples and routes:
  - [`App.jsx`](frontend/invoice-generator/src/App.jsx)
  - [`ProtectedRoute.jsx`](frontend/invoice-generator/src/components/auth/ProtectedRoute.jsx)
  - [`DashboardLayout.jsx`](frontend/invoice-generator/src/components/layout/DashboardLayout.jsx)

Maintainers & contributing
- Maintainers: refer to repository owners or commit history.
- Contribution guidelines: please follow [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) (create this file if it doesn't exist).
- Code style: this project includes an ESLint config at [`frontend/invoice-generator/eslint.config.js`](frontend/invoice-generator/eslint.config.js).

License
- See the repository LICENSE file.

Important links (workspace)
- [frontend/invoice-generator/package.json](frontend/invoice-generator/package.json)
- [frontend/invoice-generator/vite.config.js](frontend/invoice-generator/vite.config.js)
- [frontend/invoice-generator/src/App.jsx](frontend/invoice-generator/src/App.jsx)
- [frontend/invoice-generator/src/main.jsx](frontend/invoice-generator/src/main.jsx)
- [frontend/invoice-generator/src/index.css](frontend/invoice-generator/src/index.css)
- [frontend/invoice-generator/src/components/auth/ProtectedRoute.jsx](frontend/invoice-generator/src/components/auth/ProtectedRoute.jsx)
- [frontend/invoice-generator/src/components/layout/DashboardLayout.jsx](frontend/invoice-generator/src/components/layout/DashboardLayout.jsx)
- [frontend/invoice-generator/src/context/AuthContext.jsx](frontend/invoice-generator/src/context/AuthContext.jsx)
- [frontend/invoice-generator/README.md](frontend/invoice-generator/README.md)
- [backend/](backend/)
