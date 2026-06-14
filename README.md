🌿 AGRICULTURAL COMMERCE PLATFORM (MERN STACK)

A full-stack agricultural e-commerce platform with dual business model support:
B2B (Wholesale) + B2C (Retail) + Dynamic CMS Admin Dashboard

━━━━━━━━━━━━━━━━━━━━━━━
🚀 LIVE DEMO
━━━━━━━━━━━━━━━━━━━━━━━
Frontend: http://localhost:5173
Admin Panel: http://localhost:5173/admin
Backend API: http://localhost:5000

━━━━━━━━━━━━━━━━━━━━━━━
📌 PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━
This system simulates a real-world agricultural marketplace with two modes:

🏪 B2C (Retail Mode)
- Visible product pricing
- Add to Cart system
- Checkout & Orders
- Customer purchase flow

🤝 B2B (Wholesale Mode)
- Price hidden / Quote system
- Bulk enquiry system
- Business lead generation
- Supplier communication

━━━━━━━━━━━━━━━━━━━━━━━
🔄 CORE FEATURE
━━━━━━━━━━━━━━━━━━━━━━━
Mode Switch System:
- Toggle between B2B ↔ B2C from frontend
- UI changes dynamically
- Pricing + actions change automatically
- Admin controls default mode + settings

━━━━━━━━━━━━━━━━━━━━━━━
🌱 FEATURES
━━━━━━━━━━━━━━━━━━━━━━━

🧑‍🌾 FRONTEND (CUSTOMER SIDE)
- Modern agricultural UI (green, white, earthy theme)
- Fully responsive design (mobile, tablet, desktop)
- Homepage with CMS-driven sections
- Product listing with filters & search
- Product detail page
- Cart & checkout system
- B2B enquiry system
- Mode switch toggle

🛠 ADMIN PANEL (CMS SYSTEM)
- Secure JWT authentication
- Product CRUD (Create, Read, Update, Delete)
- Category management
- Order management system
- B2B enquiry management
- CMS editor (Home, About, Policies, Pages)
- Website settings control
- Mode configuration (default B2B/B2C)

━━━━━━━━━━━━━━━━━━━━━━━
🧠 TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━

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

━━━━━━━━━━━━━━━━━━━━━━━
📂 PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━

agri-commerce/
│
📂 PROJECT STRUCTURE

agri-commerce/
|
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── layouts/
│   │   │   ├── services/
│   │   │   ├── context/
│   │   │   └── App.jsx
│   │   ├── index.html
│   │   └── package.json
│   │
│   └── backend/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── seed/
│       └── server.js
|
├── docs/
├── .env.example
├── README.md
└── package.json
━━━━━━━━━━━━━━━━━━━━━━━
🔄 USER FLOWS
━━━━━━━━━━━━━━━━━━━━━━━

🏪 B2C FLOW:
Browse Products → Add to Cart → Checkout → Order Placed → Admin Processing

🤝 B2B FLOW:
Switch to Wholesale Mode → View Products → Submit Enquiry → Admin Response → Lead Management

━━━━━━━━━━━━━━━━━━━━━━━
⚙️ SETUP INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━

git clone https://github.com/your-username/agri-commerce.git

Frontend:
cd apps/frontend
npm install
npm run dev

Backend:
cd apps/backend
npm install
npm run dev

━━━━━━━━━━━━━━━━━━━━━━━
🌿 ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000

━━━━━━━━━━━━━━━━━━━━━━━
🌟 FUTURE IMPROVEMENTS
━━━━━━━━━━━━━━━━━━━━━━━
- Payment gateway integration
- AI crop recommendation system
- Real-time order tracking
- Multi-language support
- Advanced analytics dashboard

━━━━━━━━━━━━━━━━━━━━━━━
👨‍💻 AUTHOR
━━━━━━━━━━━━━━━━━━━━━━━

Karan Choudhury
Full Stack MERN Developer 🚀

━━━━━━━━━━━━━━━━━━━━━━━
🏁 FINAL NOTE
━━━━━━━━━━━━━━━━━━━━━━━
This project is a production-level MERN application with:
✔ Dual business model (B2B + B2C)
✔ Dynamic CMS system
✔ Scalable architecture
✔ Real-world e-commerce logic
