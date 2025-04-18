# 🏪 SupplyCo Website (MERN Stack)

A full-stack web application built with the MERN (MongoDB, Express, React, Node.js) stack to help clients interact with SupplyCo shops. The platform provides real-time product availability, user and shop-owner authentication, and a seamless shopping experience.

---

## 🚀 Features

### 👥 User Functionality
- Signup/Login with secure authentication
- Search SupplyCo shops by location
- View available products in each shop
- Add products to cart
- Place and manage orders

### 🧑‍💼 Shop Owner Functionality
- Signup/Login
- Add, update, or remove products
- View orders from clients
- Manage inventory

### 🛠 Admin Features (not implimented yet)
- View all users and shop owners
- Manage product categories and user permissions

---

## 🧱 Tech Stack

| Frontend         | Backend        | Database   | Other Tools               |
|------------------|----------------|------------|---------------------------|
| React.js         | Node.js        | MongoDB    | Tailwind CSS              |
| React Router     | Express.js     | Mongoose   | JWT Authentication        |
| Redux (optional) | RESTful APIs   |            | Axios, dotenv, bcrypt     |

---
```bash
## 🗂️ Project Structure
supplyco/ 
│ 
├── client/ # React frontend 
│ ├── public/ 
│ ├── src/
│ ├── package.json 
|
├── server/ # Node/Express backend
│ ├── models/ 
│ ├── routes/ 
│ ├── controllers/ 
│ ├── .env │ 
| ├── server.js 
│ 
└── README.md


## ⚙️ Installation & Setup

### 1. Clone the Repository
git clone https://github.com/midhunwalker/Supplyco-reactjs.git
cd Supplyco-reactjs

### Setup Frontend
cd ../client
npm install
npm start

Create a .env file in the server folder and add:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

Setup Backend
cd server
npm install
node index.js


🌐 Live Demo


📸 Screenshots


🧑‍💻 Author
Midhun P
🔗 GitHub
🔗 LinkedIn 

📜 License
This project is licensed under the MIT License - feel free to use and modify for personal or commercial use.
