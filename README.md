# 🌿 Agricultural Commerce Platform (MERN Stack)

A full-stack **Agricultural E-Commerce Platform** built using MERN stack with **B2B (Wholesale)** and **B2C (Retail)** dual mode system and dynamic CMS admin dashboard.

---

## 🚀 Live Demo

- 🌐 Frontend: http://localhost:5173
- ⚙️ Admin Panel: http://localhost:5173/admin
- 🔗 Backend API: http://localhost:5000

---

## 📌 Project Overview

This project simulates a real-world agricultural marketplace with two business models:

### 🏪 B2C (Retail Mode)
- Visible product pricing
- Add to Cart system 🛒
- Checkout & Orders 💳
- Customer purchase flow

### 🤝 B2B (Wholesale Mode)
- Price hidden / Request Quote system
- Bulk enquiry form
- Business lead generation
- Supplier communication system

---

## 🔄 Core Feature — Mode Switch

- Toggle between B2B ↔ B2C from frontend
- UI changes dynamically
- Pricing + actions change automatically
- Admin controls default mode

---

## 🌱 Features

### 🧑‍🌾 Frontend (Customer Side)
- Modern agricultural UI 🌿
- Fully responsive design (mobile/tablet/desktop)
- Homepage CMS-driven sections
- Product listing with search & filters
- Product detail page
- Cart & checkout system
- B2B enquiry system
- Mode switch toggle

---

### 🛠 Admin Panel (CMS System)
- Secure JWT authentication 🔐
- Product CRUD operations
- Category management
- Order management system
- B2B enquiry management
- CMS editor (Home, About, Policies, Pages)
- Website settings control
- Mode configuration (default B2B/B2C)

---

## 🧠 Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- REST APIs

---





## 📂 Project Structure

agri-commerce/
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── layouts/
│   │   │   ├── context/
│   │   │   ├── services/
│   │   │   └── App.jsx
│   │   └── index.html
│   │
│   └── backend/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── seed/
│       └── server.js
│
├── docs/
├── .env.example
└── README.md









---

## 🔄 User Flows

### 🏪 B2C Flow
Browse Products → Add to Cart → Checkout → Order Placed → Admin Processing

### 🤝 B2B Flow
Switch Mode → View Products → Submit Enquiry → Admin Response → Lead Management

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/your-username/agri-commerce.git

cd apps/frontend
npm install
npm run dev

cd apps/backend
npm install
npm run dev
```

---

## 🌿 Environment Variables

```env
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🌟 Future Improvements

- Payment gateway integration 💳
- AI crop recommendation system 🤖
- Real-time order tracking 🚚
- Multi-language support 🌍
- Advanced analytics dashboard 📊

---

## 👨‍💻 Author

Kaartik Jangid
Full Stack MERN Developer 🚀

---

## 🏁 Final Note

This project demonstrates a production-level MERN architecture with:

✔ Dual business model (B2B + B2C)  
✔ Dynamic CMS system  
✔ Scalable backend structure  
✔ Real-world e-commerce logic
