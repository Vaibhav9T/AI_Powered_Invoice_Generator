<div align="center">
  
  <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
    <img src="./frontend/invoice-generator/public/logo/logo-dark.png" alt="Ainvoy Icon" height="45" style="vertical-align: middle;" />
    <span style="font-size: 56px; font-weight: 800; letter-spacing: 4px; vertical-align: middle; line-height: 1;">AINVOY</span>
  </div>

  <br />
  <p><b>Intelligent Invoicing for Modern Businesses.</b></p>
  
  <br />
</div>

Ainvoy is a full-stack SaaS platform designed to eliminate the friction of manual billing. By leveraging AI, it allows businesses to scan physical invoices, instantly clone brand designs into dynamic templates, and automate client follow-ups.

<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/a30bae6e-7ba2-46a0-9632-53d8559d3039" />
 
## ✨ Core Features

* **🤖 AI Invoice Scanner:** Upload a picture of a messy, physical bill, and the Unified AI Scanner extracts the line items, client details, and totals perfectly into the system.
* **🎨 Intelligent Template Engine:** Users can upload their old invoice design, and Ainvoy's AI automatically extracts the theme colors, typography, and layout, generating a reusable Master Template.
* **📄 Pixel-Perfect PDF Generation:** Built with a custom print-rendering engine (`react-to-print`) that forces strict A4 dimensions and preserves background graphics for flawless PDF exports.
* **✉️ Smart Payment Reminders:** Integrated with Gemini AI to instantly draft professional, context-aware payment reminder emails injected with real user and client data.
* **🌓 Modern UI/UX:** A fully responsive, accessible, and beautifully designed interface with seamless Light/Dark mode toggling.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS v4
* React Router DOM
* Lucide React (Icons)
* React-to-Print

**Backend & AI:**
* Node.js & Express.js
* MongoDB & Mongoose
* Google Gemini API (2.5 Flash-Lite & Pro models)
* JSON Web Tokens (JWT) for Authentication

## 🚀 Quick Start

Follow these steps to run Ainvoy locally on your machine.

### Prerequisites
* Node.js (v18+)
* MongoDB URI (Local or Atlas)
* Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/ainvoy.git](https://github.com/your-username/ainvoy.git)
   cd ainvoy
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in your `backend` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Run the Application:**
   Open two terminals.
   
   *Terminal 1 (Backend):*
   ```bash
   cd backend
   npm run dev
   ```
   
   *Terminal 2 (Frontend):*
   ```bash
   cd frontend
   npm run dev
   ```

## 📂 Project Structure
Ainvoy uses a decoupled architecture, separating the React frontend from the Node.js REST API for scalability and maintainability. The custom AI controller manages all interactions with the Gemini models, while the Template engine handles dynamic styling injections.

## 📄 License
Copyright © 2026 Vaibhav Annaso Tembukade. All Rights Reserved.
