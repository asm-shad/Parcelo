# 📦 Parcelo - Parcel Delivery Frontend (React + Redux Toolkit + RTK Query)

A secure, role-based, and user-friendly **Parcel Delivery System frontend** built with **React.js, Redux Toolkit, RTK Query, TypeScript, and Tailwind CSS**.  
This application consumes the backend **Parcel Delivery API** to enable **Senders, Receivers, and Admins** to perform parcel operations and manage records seamlessly.  
(Think of it as a frontend for systems like Pathao Courier or Sundarban Courier.)

---

## 🌍 Live Demo
🔗 [Parcelo Live App](https://parcelo-iota.vercel.app/)

---

## 🚀 Features

### 🔓 Public Section
- Home Page — Introductory landing page
- About Page — Service mission & description
- Contact Page — Inquiry form (simulated)

### 🔑 Authentication
- JWT-based login & registration
- Role-based redirection (Sender / Receiver / Admin)
- Persisted authentication (remains logged in after refresh)
- Logout functionality

### 📮 Sender Dashboard
- Create parcel delivery requests
- Cancel parcels (if not dispatched)
- View all created parcels & status logs

### 📦 Receiver Dashboard
- View incoming parcels
- Confirm parcel delivery
- View delivery history

### 🛠️ Admin Dashboard
- Manage all users (block/unblock)
- Manage all parcels (update status, block/unblock)
- Assign delivery personnel (optional)

### 🔍 Parcel Tracking
- Unique tracking ID for every parcel
- Public or authenticated search by tracking ID
- Detailed status logs (status, timestamp, updatedBy, notes)

### 🌟 General Features
- Role-based navigation menu
- Global error handling & loading indicators
- Form validations (required fields, numeric checks, etc.)
- Pagination & advanced filtering
- Toast notifications for success/error
- Responsive design with clean UI
- Charts & Data Visualization
  - Overview cards (Total, Delivered, Pending, Cancelled, etc.)
  - Bar/Pie charts for trends & status distribution
  - Monthly shipment analytics
- Parcel table (searchable, filterable, paginated)
- Status timeline with visual history

---

## 🛠️ Tech Stack

**Frontend:**
- React.js + React Router
- Redux Toolkit + RTK Query
- TypeScript
- Tailwind CSS

**Backend (for reference):**
- Node.js + Express.js (REST API)
- MongoDB + Mongoose
- JWT + bcrypt (authentication & security)

---

## 📂 Project Structure (simplified)

src/
┣ components/     # Reusable UI components
┣ pages/          # Page-level components (Home, Login, Dashboard, etc.)
┣ redux/          # Redux Toolkit store & slices
┣ services/       # RTK Query API endpoints
┣ hooks/          # Custom hooks
┣ utils/          # Helper functions
┣ App.tsx         # Main app entry
┗ main.tsx        # React root file

---

## ⚡ Installation & Setup

1. Clone the repository:
   git clone <your-repo-link>
   cd parcel-delivery-frontend

2. Install dependencies:
   npm install

3. Create a `.env` file in the root directory with:
   VITE_API_BASE_URL=http://localhost:5000/api

4. Run the development server:
   npm run dev

5. Build for production:
   npm run build

---

## 🔑 Default Roles
- **Sender** → Create & manage parcels
- **Receiver** → Confirm deliveries & view history
- **Admin** → Manage users & all parcels

---

## 📊 Dashboard Highlights
- **Sender** → My Parcels, Parcel Status, Cancel options
- **Receiver** → Incoming Parcels, Delivery Confirmation
- **Admin** → User Management, Parcel Management, Status Updates, Analytics

---

## 📱 Responsive UI/UX
- Fully responsive (mobile, tablet, desktop)
- Consistent margins, spacing, and typography
- Accessible color contrasts
- Lazy-loading & skeleton loaders for performance

---

## 🙌 Credits
Developed with ❤️ using **React + Redux Toolkit + RTK Query + Tailwind CSS**  
Backend powered by **Node.js + Express + MongoDB**
