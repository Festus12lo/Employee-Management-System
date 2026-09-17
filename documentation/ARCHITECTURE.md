# System Architecture & Technical Design

## 1. Overview
The **Employee Management System (EMS)** is engineered as a modern, decoupled multi-tier web application adhering to enterprise separation of concerns and the academic Standard Operating Procedure (SOP) for CRUD-based systems.

```text
┌───────────────────────────────────────────────────────────────┐
│                      Presentation Layer                       │
│  React 19 + TypeScript + Tailwind CSS (Apple Minimal Theme)   │
│  Framer Motion (Micro-interactions) + Lucide Icons            │
│  Client-Side Form Validation & Route Protection               │
└───────────────────────────────┬───────────────────────────────┘
                                │ HTTP / JSON (Axios)
                                │ CORS: http://localhost:5173
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                       REST API Layer                          │
│  Django REST Framework (DRF) ModelViewSet + APIViews          │
│  Request Deserialization, Validation & Custom Error Mapping   │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                    Business & Model Layer                     │
│  Django ORM (Object-Relational Mapping)                       │
│  Uniqueness Constraints, MinValueValidators, Status Choices   │
└───────────────────────────────┬───────────────────────────────┘
                                │ SQL Queries (Auto-generated)
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                      Persistence Layer                        │
│  SQLite Database Engine (file-backed: db.sqlite3)             │
│  Portable Schema (Compatible with PostgreSQL / MySQL)         │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Responsibilities

### 2.1 Presentation Layer (Frontend)
- **Framework**: React 19 bootstrapped with Vite 8.
- **Language**: TypeScript with strict mode for compile-time type safety.
- **Styling**: Tailwind CSS v4 configured with an Apple-inspired minimalist visual language:
  - Slate and zinc neutral surfaces (`#f8fafc`, `#ffffff`, `#0f172a`).
  - Restrained radius curves (8–12px controls, 14–18px cards, 18–24px modals).
  - Clear visual hierarchy with generous whitespace.
- **State Management**: React `useState`, `useEffect`, `useCallback`, and Context API (`AuthContext`, `ToastContext`).
- **Data Fetching**: Centralized `api.ts` Axios service with error normalization and request/response interceptors.
- **Routing**: React Router DOM with protected routing (`/dashboard`, `/employees`, `/employees/:id`, `/settings`) and authentication gate (`/login`).

### 2.2 REST API Layer (Backend)
- **Framework**: Python 3.14 + Django 6.1 + Django REST Framework 3.18.
- **View Architecture**:
  - `EmployeeViewSet`: DRF `ModelViewSet` delivering standardized RESTful verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
  - `DashboardStatsView`: Dedicated aggregation endpoint computing real-time workforce metrics, department distribution counts, and recent hires.
  - `AuthLoginView`: Staff authentication endpoint verifying credentials and issuing authorization tokens.
- **CORS Handling**: `django-cors-headers` middleware explicitly allowing requests from `http://localhost:5173` and `http://127.0.0.1:5173`.
- **Serialization & Validation**: `EmployeeSerializer` enforcing mandatory field constraints, valid email syntax, positive salaries, and unique employee IDs/emails before hitting the database.

### 2.3 Persistence & ORM Layer (Database)
- **Database**: SQLite 3 for lightweight, zero-configuration local execution.
- **Portability**: All data types (CharField, EmailField, DecimalField, DateField, DateTimeField) and validators translate cleanly to PostgreSQL or MySQL without modifying code.
- **Migrations**: Fully tracked Django migrations under `backend/employees/migrations/`.
- **Seeding**: Custom management command `python manage.py seed_employees` to load diverse, realistic organizational records.

---

## 3. Communication Protocol & Security

### 3.1 Request / Response Lifecycle
1. **User Action**: The user submits a form or applies a search filter.
2. **Client Validation**: The frontend validates input format (e.g., email syntax, non-empty fields).
3. **HTTP Dispatch**: Axios transmits JSON payload to `http://127.0.0.1:8000/api/employees/`.
4. **CORS Check**: Django CorsMiddleware verifies origin header.
5. **DRF Deserialization**: DRF Serializer parses JSON and runs field-level validation (`validate_salary`, `validate_employee_id`, `validate_email`).
6. **ORM Execution**: Django ORM translates object operations into parameterized SQL statements executed against SQLite.
7. **JSON Response**: Serializer returns status `201 Created` or `200 OK` with JSON representation.
8. **UI State Update**: Frontend receives updated model, triggers a toast notification, updates table, and closes modal without full page reload.

### 3.2 Security Principles
- **No Hardcoded Credentials**: Django secret keys and configurations are isolated.
- **SQL Injection Prevention**: Handled automatically through Django ORM parameterized queries.
- **XSS Prevention**: React automatically escapes JSX rendering.
- **Explicit CORS**: Restricted only to development frontends rather than wildcard access.
- **Double Validation**: Server enforces all constraints even if frontend validation is bypassed.
