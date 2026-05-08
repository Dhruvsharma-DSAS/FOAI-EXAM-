# MISSION CONTROL — ISS & News Intelligence Dashboard

A premium, real-time dashboard tracking the International Space Station and providing global news intelligence. Built with React, Tailwind CSS, Framer Motion, and AI-powered insights.

## 🚀 Features

- **Live ISS Tracking**: Real-time position updates every 15 seconds with trajectory trails and orbital speed calculation.
- **Orbital Telemetry**: Live velocity trends visualized with Recharts.
- **Astronaut Manifest**: Current crew members in space with craft details.
- **Intelligence Feed**: Global news updates across multiple categories (Breaking, Tech, Science, Business, Sports).
- **Mission AI**: Context-aware chatbot powered by HuggingFace (Qwen 1.7B) to answer questions about the dashboard data.
- **Cosmic Glassmorphism**: Stunning UI with dark/light mode support and smooth motion choreography.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4
- **Animations**: Framer Motion
- **Maps**: Leaflet.js / React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **AI**: HuggingFace Router API

## 📦 Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Dhruvsharma-DSAS/FOAI-EXAM-.git
    cd FOAI-EXAM-
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your API keys:
    ```env
    VITE_GNEWS_API_KEY=your_gnews_key
    VITE_HF_TOKEN=your_huggingface_token
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## ⌨️ Keyboard Shortcuts

- `Cmd/Ctrl + K`: Focus search bar
- `Cmd/Ctrl + J`: Toggle Chatbot
- `Cmd/Ctrl + D`: Toggle Theme (Dark/Light)

---

Built with ❤️ by Dhruv Sharma
