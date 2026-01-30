# Pujnam Store - Backend API

Backend API for Pujnam Store - An e-commerce platform for puja items and spiritual products.

## 🚀 Features

- User Authentication & Authorization (JWT)
- Product Management
- Category Management
- Order Management
- Shopping Cart
- Coupon System
- Banner Management
- Panchang API Integration
- Festival Management
- Customer Management
- Email Notifications (Order Confirmation)
- File Upload (Cloudinary)

## 📦 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Cloudinary** - Image storage
- **bcryptjs** - Password hashing

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Abhinavraj53/Pujnam-Store.git
cd Pujnam-Store/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pujnam_store
JWT_SECRET=your-secret-key-here
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FREE_ASTROLOGY_API_KEY=your-astrology-api-key
```

4. **Start the server:**
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Categories, Cart, Coupons, Banners, etc.
See code for complete API documentation.

## 🌐 Deployment on Render

See `RENDER_SETUP.md` and `RENDER_FIX.md` for detailed deployment instructions.

**Quick Setup:**
1. Create new Web Service on Render
2. Set **Root Directory:** `backend`
3. Set **Start Command:** `npm start`
4. Add environment variables
5. Deploy!

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |
| `PORT` | No | Port number (default: 5000) |
| `EMAIL_USER` | Optional | Gmail for email notifications |
| `EMAIL_PASSWORD` | Optional | Gmail app password |
| `FREE_ASTROLOGY_API_KEY` | Optional | API key for Panchang |

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS configured for production
- Environment variables for sensitive data

## 📄 License

This project is private and proprietary.

## 👤 Author

Abhinavraj53
