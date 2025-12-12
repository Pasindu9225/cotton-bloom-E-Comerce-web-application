# Cotton Bloom - Full Stack E-Commerce Application

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan) ![Prisma](https://img.shields.io/badge/Prisma-ORM-green)

**Live Demo:** [https://cotton-bloom.vercel.app/](https://cotton-bloom.vercel.app/)

## 📖 Project Overview

**Cotton Bloom** is a high-performance, full-stack e-commerce platform designed for selling premium apparel. It features a modern, dual-interface system:

1.  **Customer Storefront:** A responsive shopping experience with product browsing, a shopping cart, and secure checkout.
2.  **Admin Dashboard:** A secured control panel for managing products, tracking order statuses (Pending → Shipped → Delivered), and viewing analytics.

Built with performance and scalability in mind using **Next.js 16**, **TypeScript**, and **PostgreSQL**.

---

## 🚀 Key Features

### 🛍️ Storefront
* **Dynamic Hero Slider:** Custom-built, high-performance image carousel.
* **Product Catalog:** Filterable product grids with dynamic category pages (Men/Women).
* **Shopping Cart:** Persistent cart state using Local Storage.
* **Checkout System:** Transactional order placement with stock validation.

### 🛡️ Admin Dashboard
* **Product Management:** Create new products with image uploads (via Cloudinary).
* **Order Management:** View order details and update statuses (Pending / Shipped / Delivered).
* **Analytics:** Visual data representation using Recharts.
* **Security:** Role-based access control (RBAC) protecting admin routes.

---

## 🛠️ Technology Stack

### Core
* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Build Tool:** Turbopack

### Database & Backend
* **Database:** PostgreSQL (Hosted on Neon)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Authentication:** [NextAuth.js v4](https://next-auth.js.org/)
* **Image Storage:** [Cloudinary](https://cloudinary.com/) (Unsigned Uploads)

### Libraries & Tools
* **UI Components:** Lucide React (Icons), Framer Motion (Animations)
* **Data Visualization:** Recharts
* **PDF Generation:** jsPDF & jsPDF-AutoTable
* **Validation:** Zod (via server actions)

---

## 🗄️ Database Schema

The database is managed via Prisma ORM. Key models include:

* **User:** Authentication & Roles (`customer` vs `admin`).
* **Address:** Shipping information linked to users.
* **Product & Category:** Hierarchical categorization and product details.
* **ProductVariant:** Inventory management for specific sizes/colors.
* **Order & OrderItem:** Transactional data linking users to purchased variants.

---

## 📂 Project Structure

```text
cotton-bloom/
├── .github/                # CI/CD Pipelines
├── app/
│   ├── actions/            # Server Actions (Backend Logic)
│   ├── admin/              # Admin Dashboard Routes (Protected)
│   ├── api/                # NextAuth API Routes
│   ├── (storefront)/       # Public Routes (Cart, Checkout, Shop)
│   └── page.tsx            # Home Page
├── components/             # Reusable UI Components
├── lib/                    # Utilities (Prisma Client, Formatters)
├── prisma/                 # DB Schema & Seed Scripts
└── public/                 # Static Assets
