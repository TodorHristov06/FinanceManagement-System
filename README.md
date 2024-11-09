# Atlas Vault


>Atlas Vault, inspired by Ayn Rand's Atlas Shrugged, symbolizes the strength and resilience required to manage the weight of one’s own world—here represented by personal finances and data security. Like Atlas bearing the weight of the heavens, this application empowers you to take control of your financial records, providing a structured, secure space to navigate and organize financial complexities.
Starting Atlas Vault could reflect a passion for creating tools that provide clarity, self-sufficiency, and streamlined data handling, empowering users to shoulder and master their own financial "vault."
>
A web-based application for managing fynances with features like account creation, editing, and deletion. This project utilizes React, Next.js, Zustand, and Hono.js to provide a seamless user experience for managing financial accounts.

## Features

- **Account Management**: Create, read, edit, and delete accounts.
- **Real-time Data**: Fetch and update account data in real time with React Query.
- **Confirmation Dialog**: Ensure accidental deletions are prevented with a confirmation dialog.
- **Modular Components**: Reusable components for account actions and forms.
- **Optimistic UI Updates**: Provide immediate feedback to users when modifying account data.
- **Account Authentication**: Ensures robust security and protection for user accounts, safeguarding user data and enhancing their overall experience.
- **Data Visualization with Charts**: Offers visually engaging charts to clearly illustrate user expenses, making financial insights easily accessible and understandable.

## Tech Stack

>- **Frontend**:
  - React
  - Next.js (API Routes, React Query, Zustand for state management)
  - ShadCN for UI components
  - Lucide React for icons
  - TypeScript
  - Clerk for authentication 
>- **Backend**:
  - Hono.js (for API communication)
  - Drizzle ORM and Neon DB for database interactions

## Setup and Installation
### Prerequisites
Ensure you have the following installed:

- Node.js (v16 or higher)
- Bun
## Installation
### Clone the Repository:

bash
```
git clone https://github.com/yourusername/atlas-vault.git
cd atlas-vault
```
Install Dependencies:

```
bun install
```
Set Up Environment Variables: Create an .env.local file in the root directory. Fill in the necessary environment variables for database and authentication configuration:

```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
```
Start the Development Server:

```
bun run dev
```
Open your browser and navigate to http://localhost:3000 to view the app.
