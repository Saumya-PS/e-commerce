# Week 4 Mini Project - E-Commerce Web Application

A simple full stack MERN e-commerce app: product listing, user auth (login/signup),
cart, order management, and an admin dashboard to manage products and orders.

## Folder structure

```
week4-ecommerce-app/
  backend/
    models/       -> User.js, Product.js, Order.js
    middleware/    -> auth.js (verifyToken, isAdmin)
    routes/        -> authRoutes.js, productRoutes.js, cartRoutes.js, orderRoutes.js
    server.js      -> main entry point
    seed.js        -> adds sample products to the database
  frontend/
    src/
      components/  -> Navbar, Login, Register, ProductList, Cart, Orders, AdminDashboard
      App.js        -> routes + login state
      api.js        -> backend URL (change this after deployment)
```

## Running locally

**1. Backend**
```
cd backend
npm install
npm start
```
Backend runs on `http://localhost:5000`.

**2. Frontend** (in a separate terminal)
```
cd frontend
npm install
npm start
```
Frontend opens at `http://localhost:3000`.


## API routes (quick reference)

| Method | Route                          | Who         | What it does              |
|--------|---------------------------------|-------------|----------------------------|
| POST   | /api/auth/register              | anyone      | create a new account       |
| POST   | /api/auth/login                 | anyone      | login, get a JWT token     |
| GET    | /api/products                   | anyone      | list products              |
| POST   | /api/products                   | admin       | add a product              |
| PUT    | /api/products/:id               | admin       | update a product           |
| DELETE | /api/products/:id               | admin       | delete a product           |
| GET    | /api/cart                       | logged in   | view your cart             |
| POST   | /api/cart/add                   | logged in   | add item to cart           |
| POST   | /api/orders/checkout            | logged in   | turn cart into an order    |
| GET    | /api/orders/my-orders           | logged in   | your own order history     |
| GET    | /api/orders/all                 | admin       | view every user's orders   |


