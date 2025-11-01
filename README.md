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
* ADMIN sees all resources, BILLER & CUSTOMER strict resource ownership.
* Reminder logic auto‑generates based on due dates
* Refresh token flow assumes a client that supports HTTP-only cookies.

## 🛠️ Technology Stack

* **Node.js + Express**
* **TypeScript**
* **Prisma ORM (PostgreSQL)**
* **JWT Auth**
* **Zod** for validation

## ⚙️ Environment Variables

```
see .env.example
```

## ▶️ Running the Project

```bash
npm install
npx prisma generate
npm run dev
```

## ✅ API Highlights

* **Auth**: login, signup, refresh token, logout
* **Users**: list + get by ID
* **Bills**: create, list, get, update
* **Payments**: create with idempotency key
* **Reminders**: list + get by ID, auto‑generate

## 📄 Docs

Swagger docs available under `/api/docs`


