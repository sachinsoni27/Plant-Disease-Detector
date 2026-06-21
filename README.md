# 🌿 PlantAI — Plant Disease Detector

A modern, AI-powered plant disease detection web application built with **React + Vite + Firebase**.

![PlantAI Banner](https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=1200&h=400&fit=crop&q=80)

## ✨ Features

- 🤖 **AI-Powered Detection** — Uses Google Gemini & Hugging Face models to analyze leaf images
- 📊 **Disease Dashboard** — Real-time stats and crop health overview
- 🗂️ **Analysis History** — Saved locally per-user with search, view, and delete
- 🌦️ **Environment Widget** — Live location-aware weather & disease risk assessment
- 🌙 **Dark / Light Mode** — Persistent theme preference
- 🔐 **Firebase Auth** — Email/password + Google login
- 📄 **PDF Reports** — Download detailed disease reports
- 💬 **AI Chat Assistant** — In-app agricultural chatbot
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 + custom glassmorphism |
| Animation | Framer Motion |
| Auth | Firebase Authentication |
| Database | Firestore |
| AI (primary) | Google Gemini 1.5 Flash |
| AI (fallback) | Hugging Face Inference API |
| PDF | jsPDF + html-to-image |
| Icons | Lucide React |

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sachinsoni27/Plant-Disease-Detector.git
cd Plant-Disease-Detector
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your environment file
Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_HUGGING_FACE_API_KEY=your_hf_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthModal.jsx    # Login/Signup modal
│   ├── DashboardLayout.jsx
│   ├── Sidebar.jsx
│   ├── ThemeToggle.jsx
│   └── WeatherWidget.jsx
├── context/             # React context providers
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/               # Custom hooks
│   └── useLocalHistory.js
├── pages/               # Route-level pages
│   ├── AnalysisPage.jsx
│   ├── DashboardPage.jsx
│   ├── HistoryPage.jsx
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── NotFound.jsx
│   ├── ProfilePage.jsx
│   └── SignupPage.jsx
├── utils/               # Business logic
│   ├── analyzeImage.js  # AI analysis pipeline
│   └── diseaseData.js   # Disease knowledge base
├── firebase.js          # Firebase initialization
└── App.jsx              # Routes & auth guards
```

## 🌿 Disease Detection

The app uses a **parallel race strategy** between two AI models:
1. **Google Gemini 1.5 Flash** - Vision model for zero-shot disease identification
2. **Hugging Face** - Fine-tuned plant disease classification model (fallback)

Whichever responds first wins. If both fail (e.g., quota exhausted), a demo fallback ensures the UI remains functional.

## 📜 License

MIT License - feel free to fork and build on this!

---

Built with ❤️ by [Sachin Soni](https://github.com/sachinsoni27) (sachinsoniofficial2003@gmail.com)
