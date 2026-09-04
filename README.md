# 🤖 AI Event Planner

> An AI-powered full-stack platform for planning, organizing, and
> managing events in one place.

## 🌟 Overview

AI Event Planner is a full-stack web application designed to simplify
event planning by combining traditional event management features with
AI-powered assistance.

The platform helps users organize events, manage guests and vendors,
track budgets, communicate in real time, and receive AI-powered
recommendations.

---

## ✨ Key Features

### 🤖 AI-Powered Planning

- AI-assisted event recommendations
- Intelligent planning suggestions
- Google Gemini integration

### 👥 Event Management

- Create and manage events
- Guest management
- RSVP tracking
- Vendor management
- Budget tracking

### 💬 Real-Time Communication

- Real-time messaging
- Socket.IO integration
- Event-based communication

### 🔐 Authentication & Security

- Google OAuth authentication
- Secure user authentication
- Protected routes
- Password/security best practices

### 📊 Dashboard & Analytics

- Event overview
- Budget tracking
- Guest statistics
- Vendor information
- Analytics dashboard

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │  UI + State + Auth  │
                    └──────────┬──────────┘
                               │
                         REST API / Socket.IO
                               │
                    ┌──────────▼──────────┐
                    │   Node.js / Express │
                    │      Backend API    │
                    └───────┬───────┬─────┘
                            │       │
                  ┌─────────▼─┐   ┌─▼────────────┐
                  │  MongoDB  │   │ Gemini AI    │
                  │ Database  │   │ Integration  │
                  └───────────┘   └──────────────┘

## 📂 Project Structure

```text
AIEVENT/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
│
└── README.md
