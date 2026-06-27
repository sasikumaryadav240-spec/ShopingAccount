# 🚀 ShopFlow Backend API

A scalable REST API for **ShopFlow**, an Inventory and Order Management System built for small businesses. This backend provides secure authentication, customer management, inventory tracking, order processing, financial management, and reporting using modern backend technologies.

---

## 📌 Features

- 🔐 JWT Authentication
- 👤 Role-Based Access Control (Admin/User)
- 📦 Product Management
- 👥 Customer Management
- 🛒 Order Management
- 📊 Dashboard Statistics
- 💰 Expense Management
- 📈 Sales Reports
- 🔍 Search & Filtering
- 📄 Pagination
- ✅ Input Validation
- ⚡ Centralized Error Handling
- 🌐 RESTful API Architecture
- ☁️ Cloudinary Image Support
- 🔒 Protected Routes

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- Cloudinary
- Multer
- Express Validator
- CORS
- Dotenv

---

## 📂 Project Structure

```
src/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── config/
├── validations/
└── server.js
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/sasikumaryadav240-spec/shopingAccout.git
```

Move into the project

```bash
cd shopflow-backend
```

Install dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGODB_URI=MongoDB-Atlas

JWT_SECRET=Use a 100 character and Numbers

CLOUDINARY_CLOUD_NAME=Cloud

CLIENT_URL=http://localhost:5173
```

---

## ▶️ Run the Project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## 📚 Main API Modules

### Authentication

- Register User
- Login User
- Get Current User

### Dashboard

- Dashboard Statistics
- Revenue Summary

### Customers

- Add Customer
- Update Customer
- Delete Customer
- Search Customers

### Products

- Add Product
- Update Product
- Delete Product
- Product Categories

### Orders

- Create Order
- Update Order
- Delete Order
- Order History

### Expenses

- Add Expense
- Expense Reports

### Reports

- Sales Report
- Monthly Analytics
- Dashboard Charts

---

## 🔒 Authentication

Protected APIs require a JWT token.

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📸 API Images

Images are uploaded and stored using **Cloudinary**.

---

## 📈 Key Highlights

- RESTful API Design
- Clean Project Structure
- Scalable Folder Architecture
- JWT Authentication
- Role-Based Authorization
- MongoDB Aggregation
- Pagination
- Filtering
- Search APIs
- Validation Middleware
- Error Handling Middleware

---

## 🧪 Future Improvements

- Email Notifications
- Redis Caching
- Docker Support
- Unit Testing
- Swagger Documentation
- Payment Integration

---

## 👨‍💻 Author

**Sasi Kumar Yadav**

Backend Developer | MERN Stack Developer

GitHub:
https://github.com/sasikumaryadav240-spec

---

## 📄 License

This project is licensed under the MIT License.
