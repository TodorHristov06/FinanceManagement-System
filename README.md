# Atlas Vault

> **Atlas Vault**, inspired by Ayn Rand's *Atlas Shrugged*, symbolizes the strength and resilience required to manage the weight of one’s own world—here represented by personal finances and data security. Like Atlas bearing the weight of the heavens, this application empowers you to take control of your financial records, providing a structured, secure space to navigate and organize financial complexities.  
>  
> Starting Atlas Vault reflects a passion for creating tools that offer clarity, self-sufficiency, and streamlined data handling—empowering users to shoulder and master their own financial "vault."

A web-based application for managing finances, featuring account creation, editing, and deletion. Built with modern web technologies including React, Next.js, Zustand, and Hono.js to deliver a fast and intuitive user experience.

📦 **Live Demo**: [atlasvault.vercel.app](https://atlasvault.vercel.app/)

---

## 🚀 Features

- **Account Management** – Create, read, update, and delete financial accounts.
- **Real-Time Data Sync** – Use React Query to fetch and update data in real time.
- **Confirmation Dialogs** – Prevent accidental deletions with confirmations.
- **Modular Components** – Clean and reusable components for form handling and account operations.
- **Optimistic UI Updates** – Instant UI feedback while waiting for the server response.
- **Secure Authentication** – Integrated with Clerk to protect user data and sessions.
- **Data Visualization** – Interactive charts for clear insights into expenses and income.
- **Receipt Recognition & Currency Conversion** – AI-based receipt scanning with automatic conversion to EUR.
- **CSV Import** – Easily upload and manage financial data from spreadsheets.

---

## 🧰 Tech Stack

### Frontend
- **React**
- **Next.js** (API Routes)
- **TypeScript**
- **Zustand** – State management
- **React Query** – Data synchronization
- **ShadCN** – UI components
- **Lucide React** – Icon set
- **Clerk** – Authentication

### Backend
- **Hono.js** – Lightweight backend framework
- **Drizzle ORM** – Type-safe database access
- **Neon DB** – Serverless PostgreSQL

---

## 🛠️ Setup and Installation

### Prerequisites
Make sure you have the following installed:
- Node.js (v16+)
- [Bun](https://bun.sh/)

### Installation

```bash
git clone https://github.com/TodorHristov06/FinanceManagement-System
cd finance-system
bun install
