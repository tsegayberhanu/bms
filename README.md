# BMS

This project is a billing management system built with **Node.js**, **Express**, **TypeScript**, **Postgresql**,**Prisma**, and **JWT authentication**. It supports role‑based access control and payment/reminder workflows for a simple billing platform.

## 🚀 Features

* User roles: **Admin**, **Biller**, **Customer**
* Bill creation, assignment, and tracking
* Payment processing with idempotency support (`transactionKey`)
* Automated reminder generation for bills (Upcoming / Due / Overdue)
* Role‑aware access to bills and reminders
* Secure JWT authentication
* Centralized error handling and standardized API responses
* Zod validation schemas

## 🧠 System Behavior & Assumptions

* Every user has **one role only**: `ADMIN` / `BILLER` / `CUSTOMER`
* No email verification or password reset flows (user considered verified after signup)
* Wallet behavior is assumed — **No wallet balance checks or updates**
* Account Management: No real account/wallet system
* Users assumed to use **one device/session** only — logging out kills all sessions
* Bills can be configured as **one-time (must be paid in full)** or **partial-payment allowed**
* ADMIN sees all resources, BILLER & CUSTOMER strict resource ownership.
* Reminder logic auto‑generates based on due dates
* Reminder sending = simulated, not delivered to users
* Refresh token flow assumes a client that supports HTTP-only cookies.

## 🛠️ Technology Stack

* **Node.js + Express**
* **TypeScript**
* **Prisma ORM (PostgreSQL)**
* **JWT Auth**
* **Zod** for validation


## ✅ API Highlights

* **Auth**: login, signup, refresh token, logout
* **Users**: list + get by ID
* **Bills**: create, list, get, update
* **Payments**: create with idempotency key
* **Reminders**: list + get by ID, auto‑generate
* **Analytics**:

    * **Collection rate**
    * **Bill status summary**
    * **Outstanding payments**
    * **Customer spending**
    * **Reminder effectiveness**
    * **Reminder status distribution**
    * **User role distribution**

## 🏗️ Installation & Setup Guide

### ✅ Prerequisites

Make sure you have the following installed:

| Tool              | Version                    |
| ----------------- | -------------------------- |
| Node.js           | ≥ 18.x                     |
| PostgreSQL        | ≥ 14.x                     |
| npm / pnpm / yarn | latest recommended         |

---

### 📦 Clone & Install Dependencies

```bash
git clone https://github.com/tsegayberhanu/bms.git
cd bms
npm install
```

---

### ⚙️ Environment Configuration

Copy example env and configure:

```bash
cp .env.example .env
```

Edit `.env` and update values:

* Database connection (PostgreSQL)
* JWT secrets
* Refresh token config
* Server port

### 🗄️ Database Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev --name init
```

---

### ▶️ Start the Server

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

---


## 📄 Docs

Swagger docs available under `/api/api-docs`

Deployed on Render (test server) : https://bms-3k5g.onrender.com/api/api-docs


