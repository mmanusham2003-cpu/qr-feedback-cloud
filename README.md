# 🎤 QR-Based Interactive Feedback Cloud

A real-time, QR-based feedback system where event attendees scan a QR code, submit their thoughts, and see them appear instantly as animated message bubbles on a live display wall.

![Live Feedback Cloud](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-19-blue) ![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black) ![Vite](https://img.shields.io/badge/Vite-8-purple)

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | [qr-feedback-cloud.vercel.app](https://qr-feedback-cloud.vercel.app) |
| **Submit Feedback** | [qr-feedback-cloud.vercel.app/submit](https://qr-feedback-cloud.vercel.app/submit) |
| **Backend (Render)** | [qr-feedback-cloud-backend.onrender.com](https://qr-feedback-cloud-backend.onrender.com) |

---

## 📋 Features

- **QR Code Scanning** — Attendees scan the on-screen QR code with their phone camera to open the feedback form instantly
- **Mobile-Friendly Form** — Clean, glassmorphism-styled form to submit Name and Feedback Message
- **Real-Time Display** — Feedback appears on the main wall as animated message bubbles without any page refresh (powered by Socket.io)
- **Animated Message Bubbles** — Each message slides in with smooth animations, colored avatars, and hover effects
- **Premium Dark UI** — Modern design with glassmorphism, gradient borders, floating animations, and pulsing neon glows

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 8 |
| **Styling** | Vanilla CSS (Glassmorphism, CSS Animations) |
| **Backend** | Node.js, Express 5 |
| **Real-Time** | Socket.io (WebSockets) |
| **Icons** | Lucide React |
| **QR Code** | `qrcode` npm package |
| **Hosting** | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
qr-feedback-cloud/
├── backend/
│   ├── server.js          # Express + Socket.io server
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── index.html
│   ├── vercel.json        # SPA rewrite rules for Vercel
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── main.tsx        # App entry point with BrowserRouter
│       ├── App.tsx         # Route definitions (/ and /submit)
│       ├── index.css       # Complete design system & animations
│       ├── assets/
│       │   └── qr-code.png # Static QR code image
│       └── pages/
│           ├── CloudDisplay.tsx    # Main wall with QR + live messages
│           └── SubmitFeedback.tsx  # Mobile feedback submission form
├── .gitignore
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Step 1: Clone the Repository

```bash
git clone https://github.com/mmanusham2003-cpu/qr-feedback-cloud.git
cd qr-feedback-cloud
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm start
```

The backend will start on **http://localhost:4000**.

### Step 5: Start the Frontend Dev Server

Open a **second terminal** and run:

```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:5173**.

### Step 6: Open the Application

- **Main Wall (Display Screen):** Open [http://localhost:5173](http://localhost:5173) on your laptop/projector
- **Submit Feedback (Mobile):** Open [http://localhost:5173/submit](http://localhost:5173/submit) on your phone, or scan the QR code shown on the main wall

> **💡 Tip:** To access the app from your phone on the same Wi-Fi network, use the Network URL shown in the Vite terminal output (e.g., `http://192.168.x.x:5173/submit`).

---

## 🌍 Deployment

### Backend → Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New +** → **Web Service**
3. Connect the `qr-feedback-cloud` repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Deploy — note the URL (e.g., `https://qr-feedback-cloud-backend.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import the `qr-feedback-cloud` repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Environment Variable:**
     - Key: `VITE_BACKEND_URL`
     - Value: `https://qr-feedback-cloud-backend.onrender.com` (your Render URL)
4. Deploy

### Update QR Code for Production

After deployment, regenerate the QR code to point to your live Vercel URL:

```bash
cd frontend
node -e "const QRCode = require('qrcode'); QRCode.toFile('./src/assets/qr-code.png', 'https://YOUR-APP.vercel.app/submit', { color: { dark: '#0f172a', light: '#ffffff' }, width: 400, margin: 2 }, (err) => { if (err) throw err; console.log('Done'); })"
```

Then commit and push — Vercel will auto-redeploy.

---

## 🔄 How It Works

```
┌─────────────────┐     Socket.io      ┌─────────────────┐
│   📱 Phone      │ ──── emit ────────→ │   🖥️ Backend    │
│  /submit page   │    send_message     │   (Port 4000)   │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                          broadcast to all
                                                 │
                                        ┌────────▼────────┐
                                        │   🖥️ Main Wall  │
                                        │   / (display)   │
                                        │  Message appears │
                                        │  instantly!      │
                                        └─────────────────┘
```

1. User scans QR code → opens `/submit` on their phone
2. User fills in Name + Message → clicks "Send to Screen"
3. Frontend emits `send_message` event via Socket.io to the backend
4. Backend receives, stores in memory, and broadcasts `new_message` to **all** connected clients
5. Main wall receives the event and renders a new animated bubble instantly

---

## ⚠️ Notes

- **Render Free Tier:** The backend may spin down after 15 minutes of inactivity. The first request after spin-down takes ~30–50 seconds to wake up.
- **In-Memory Storage:** Messages are stored in server memory (capped at 50). They reset when the server restarts. For persistence, integrate a database like MongoDB or PostgreSQL.
- **QR Code:** The static QR image must be regenerated if the frontend URL changes.

---

## 📄 License

ISC
