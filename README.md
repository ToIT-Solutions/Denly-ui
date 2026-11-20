# Denly – Frontend

## Overview
This is the frontend for Denly.  
It provides a clean and simple interface for landlords and property managers to manage their properties, tenants, payments, and documents from a single dashboard.

The frontend communicates with the backend API and focuses on usability, performance, and clarity so users can quickly access important information about their rental portfolio.

---

## Features

### Property Management
- View and manage all properties in one place
- See property details and tenant assignments
- Edit property information when needed

### Tenant Management
- Add and manage tenants
- Store tenant contact and lease information
- Track tenant status (active, pending, terminated, inactive)

### Payments
- Track rent payments
- View payment history
- Filter payments by status, date, or tenant

### Document Storage
- Upload and manage important tenant or property documents
- Store leases and related files securely

### Dashboard Insights
- Overview of properties and tenants
- Financial summaries
- Quick access to important information

---

## Tech Stack

- **Next.js** 
- **React**
- **TypeScript** 
- **Tailwind CSS** 
- **React Query**
- **Axios**
- **Zustand**

---


### API URL for local and production builds

Set `NEXT_PUBLIC_API_URL` to the backend URL including `/api`. Development defaults to `http://localhost:8888/api`. Production builds require an explicit value; use the verified HTTPS backend origin in a deployed build. A loopback HTTP URL is accepted only for local production-build QA. This variable is public and embedded during build, so never place credentials in it. Rebuild after changing the API origin. The frontend does not add an API proxy automatically. See `.env.example`; no live environment variables are changed by this configuration support.
