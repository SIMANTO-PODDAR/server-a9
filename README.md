# 🚘 DriveFleet Server — Backend API Service

DriveFleet Server is the backend REST API powering the DriveFleet car rental platform. Built with Express.js and MongoDB, it handles vehicle management, bookings, authentication verification, and secure protected routes for a seamless car rental experience.

This server provides scalable APIs for managing rental cars, bookings, and user-specific operations while maintaining secure communication with the frontend application.

---

# 🌐 Client Application

Frontend Repository & Live Application:

* Client App: [https://drivefleet-by-sp.vercel.app](https://drivefleet-by-sp.vercel.app)

---

# ✨ Features

## 🔐 Secure Authentication Middleware

Protected API routes using JWT verification powered by `jose-cjs` and Better Auth JWKS authentication.

* Token-based authorization
* Protected private routes
* Secure middleware verification
* JWKS remote validation support

---

## 🚗 Car Management System

Complete CRUD functionality for rental cars:

* Add new cars
* Get all cars
* Get single car details
* Update car information
* Delete car listings
* Retrieve user-added cars

---

## 🔍 Advanced Search & Filtering

Dynamic filtering system using MongoDB query operators:

* Search cars by name
* Filter by car type
* Case-insensitive regex search
* Dynamic query building

Example:

```js
query.Name = {
  $regex: search,
  $options: "i"
};
```

---

## 📅 Booking Management

Booking APIs for handling rental reservations:

* Create bookings
* Fetch user bookings
* Automatically increment booking count
* User-specific booking retrieval

---

## ⚡ MongoDB Native Driver Integration

Efficient MongoDB integration using the official native driver:

* Optimized query handling
* Collection-based architecture
* ObjectId support
* Lightweight database operations

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express.js

## Database

* MongoDB Native Driver

## Authentication

* Better Auth
* jose-cjs
* JWT Verification

## Middleware & Utilities

* cors
* dotenv

---

# 📂 API Endpoints

## 🚗 Cars Routes

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/all-cars`           | Get all cars        |
| GET    | `/all-cars/:id`       | Get single car      |
| POST   | `/all-cars`           | Add new car         |
| PATCH  | `/all-cars/:carId`    | Update car          |
| DELETE | `/all-cars/:id`       | Delete car          |
| GET    | `/available-cars`     | Get available cars  |
| GET    | `/added-cars/:userId` | Get user added cars |

---

## 📅 Booking Routes

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/all-bookings`         | Create booking    |
| GET    | `/all-bookings/:userId` | Get user bookings |

---

# 🚀 Local Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/SIMANTO-PODDAR/server-a9.git

cd server-a9
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

CLIENT_URL=http://localhost:3000
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

Server will run on:

```bash
http://localhost:5000
```

---

# 🔒 Protected Routes

The following routes use authentication middleware:

```js
POST   /all-cars
GET    /added-cars/:userId
GET    /all-bookings/:userId
```

---
