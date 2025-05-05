# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Sapar Frontend

This is the frontend application for Sapar, a travel platform focused on Kazakhstan tourism.

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API Configuration
VITE_API_URL=http://localhost:8080/api/v1

# Feature flags
VITE_ENABLE_MOCK_DATA=true

# Telegram Configuration for Contact Form
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_TELEGRAM_CHAT_ID=your_chat_id
```

### Telegram Bot Setup

To set up Telegram integration for the contact form:

1. Create a new Telegram bot using BotFather (https://t.me/botfather)
2. Get your bot token from BotFather
3. Create a group or channel where messages will be sent
4. Add your bot to the group/channel
5. Get the chat ID (you can use https://t.me/userinfobot or other methods)
6. Add the bot token and chat ID to your `.env` file

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the production build locally
