# AI React Lab 🧪

Welcome to the AI React full-stack laboratory for AI-powered web applications. This repository combines a high-performance React frontend with an Express backend, integrating both cloud-based LLMs and client-side machine learning.

## 🚀 Key Features

*   **Dual AI Architecture**: 
    *   **Cloud AI**: Powered by Google's Gemini API via `@google/genai`.
    *   **Local/Client-side AI**: Powered by `@xenova/transformers` for running models directly in the browser or Node environment.
*   **Modern Frontend**: Built with **React 19**, **Vite**, and **TypeScript** for blazing-fast development and type safety.
*   **Styling & UI**: Out-of-the-box support for **Tailwind CSS v4**, **Shadcn UI**, and **Radix UI** primitives.
*   **Backend Support**: Built-in **Express** server with TypeScript support (`ts-node`) and hot-reloading (`nodemon`).
*   **Database Integration**: Ready-to-use client setup for **Supabase**.
*   **Testing & Code Quality**: Fully configured with **Jest**, **ESLint**, and **Prettier**.

## 🛠️ Tech Stack

*   **Frontend**: React 19, React Router DOM v7, Lucide Icons, Geist Font.
*   **Backend**: Express 5, Axios, Cors, Dotenv.
*   **AI/ML**: Google Gen AI SDK, Xenova Transformers (Hugging Face in JS).
*   **Database/Auth**: Supabase JS Client.
*   **Build Tools**: Vite 8, TypeScript 5, Tailwind CSS v4 Vite Plugin.

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) installed (v18+ recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com
   cd ai-react-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your API credentials:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=5000
   ```

### Available Scripts

In the project directory, you can run the following commands:

#### Development

*   `npm run dev`: Starts the Vite development server for the React frontend.
*   `npm run start:node`: Starts the Express backend server with hot-reloading.

#### Production

*   `npm run build`: Compiles both TypeScript and Vite frontend for production.
*   `npm run preview`: Locally previews the production build.

#### Code Quality & Testing

*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run test`: Runs unit tests using Jest.
*   `npm run prettier:fix`: Automatically formats all code files using Prettier.

## 📁 Project Structure

```text
├── src/
│   ├── server/          # Express backend application
│   │   └── index.ts     # Server entry point
│   ├── components/      # UI components (Shadcn/Radix)
│   ├── main.tsx         # React application entry point
│   └── ...
├── .env.example         # Example environment variables
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```
