# B2C Store Application
This repository has been created for WSU comp2016 major assignment.

## Objective

Design and develop a Business-to-Consumer (B2C) Store application that enables users to browse and purchase products while providing administrative functionality to manage products and view purchase records. This project is an extension of the current assignment and builds upon its existing codebase.

---

## 📌 Features

### ✅ Core Functionality

- **Frontend**:
  - Display product listings with name, description, price, and images.
  - Category-based filtering (e.g., electronics, clothing).
  - Search functionality by product name.
  - Shopping cart for adding/removing products.
  - Checkout functionality with mock payment integration.

- **Backend**:
  - RESTful or tRPC API for product and purchase management.
  - Admin endpoints for CRUD operations on products.
  - Endpoints to fetch purchase history based on user ID.

- **Database**:
  - Relational (PostgreSQL, MySQL) or non-relational (MongoDB) database support.
  - Schema includes users, products, categories, and purchase records.

- **User Interface**:
  - Clean, responsive design using Tailwind CSS or Bootstrap.
  - Accessibility features (ARIA labels, keyboard navigation).
  - Mobile-first responsive layout.

---

## 🚀 Minimum Features

1. **User Authentication**:
   - Secure registration/login for users and admins (JWT, OAuth).
2. **Shopping Cart**:
   - Add/remove items, view total before purchase.
3. **Payment Integration**:
   - Mock or real integration with Stripe/PayPal.
4. **Purchase History**:
   - Past purchases shown with date, items, and total amount.
5. **Admin Dashboard**:
   - Product management and purchase history overview.

---

## 🧰 Tech Stack

- **Frontend**: React.js (or Vue.js / Angular)
- **Backend**: Node.js (Express.js), or Django / Laravel
- **Database**: PostgreSQL / MySQL / MongoDB
- **Styles**: Tailwind CSS / Bootstrap
- **Version Control**: Git + GitHub/GitLab

---

## 📦 Setup Instructions

### Prerequisites

- Node.js and npm/yarn
- Database (PostgreSQL/MySQL/MongoDB)
- Git

### Clone the Repository

```bash
git clone https://github.com/yourusername/b2c-store-app.git
cd b2c-store-app
