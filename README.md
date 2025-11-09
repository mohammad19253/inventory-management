# 🌿 Multi-Warehouse Inventory Management System

### Developed by **Mohammad Mirzae**

## Overview

An enhanced, production-ready **Multi-Warehouse Inventory Management System** built with **Next.js** and **Material-UI (MUI)** for GreenSupply Co, a sustainable product distribution company.  
This project extends the base version by delivering a modern dashboard, a fully functional stock transfer workflow, and a proactive low-stock alert system — all backed by persistent JSON data storage and a polished UI/UX.

---

## 🛠️ Tech Stack

- **Next.js** – React framework for SSR & routing
- **React.js**
- **Material-UI (MUI)** – UI component library
- **React Query** – data fetching & server state management
- **React Hook Form + Zod** – form handling & validation
- **Recharts** – charting and data visualization
- **JSON files** – simple persistence layer for assessment

---

## 🚀 Features Implemented

### ✅ 1. Dashboard Redesign

- Modern, clean, eco-friendly UI
- Fully responsive layout for all devices
- Key performance metrics:
  - Total inventory value
  - Number of warehouses
  - Number of products
  - Count of low-stock items
- Interactive visual charts using **Recharts**
- Integrated low-stock alerts into dashboard
- Loading indicators & error handling
- Improved layout with cards, grids, and visuals

---

### ✅ 2. Stock Transfer System

#### 🔧 Backend / Data

- Created `data/transfers.json` to store transfer records
- Implemented API routes:
  - `GET /api/transfers`
  - `POST /api/transfers`
- Business logic includes:
  - Deduct stock from source warehouse
  - Add stock to destination warehouse
  - Check for negative stock
  - Validate warehouse/product IDs
  - Store transfer details persistently

#### 🖥️ UI / Frontend

- `/transfers` page includes:
  - A complete stock transfer form
  - Real-time field validation with **react-hook-form + zod**
  - User feedback messages (error/success)
  - Transfer history table with details

---

### ✅ 3. Low Stock Alert & Reorder System

- Automatic calculation of total product stock across all warehouses
- Implements stock categorization:
  - Critical
  - Low
  - Sufficient
  - Overstocked
- `/alerts` page to manage all alerts
- Ability to mark alerts as resolved
- Reorder recommendations and thresholds
- Alerts overview shown directly on the dashboard
- Persistent storage in `data/alerts.json`

---

## ✨ Bonus Features Added

### ✅ **Order CRUD System**

- Added `/orders` page for managing orders
- Create, edit, delete, and list orders
- Data stored in `data/orders.json`
- Integrated with alert system (user can create an order after seeing low stock)

### ✅ **Dark Mode Support**

- Added theme toggle using Material-UI theme provider
- Full app supports dark and light themes
- Persistent theme state

### ✅ **Enhanced UI/UX**

- Consistent color palette (eco-friendly green theme)
- Smooth layout, table styling, cards, spacing
- Better loading states & empty-state screens

---

## 🧠 Technical Decisions

### ✅ Data & State Management

- **React Query** chosen for:
  - Automatic caching
  - Refetching
  - Loading/error states

### ✅ Forms

- **React Hook Form + Zod** for:
  - High performance
  - Schema-driven validation
  - Simple integration with MUI

### ✅ Charts

- **Recharts** selected for:
  - Lightweight + responsive components
  - Easy integration with dashboard cards

### ✅ Styling & Theme

- Used **MUI** for consistent component design
- Implemented custom eco-friendly theme + dark mode support

### ✅ Persistence

- JSON-based storage to match assessment requirements

---

## ⚠️ Known Limitations

- No unit or integration tests included
- JSON file system unsuitable for multi-user production use
- Alert forecasting simplified (no lead time or demand prediction)
- Some transitions/animations could be more polished

---

## 🧪 Setup & Testing

Run the project locally:

```bash
npm install
npm run dev
npm start
```
