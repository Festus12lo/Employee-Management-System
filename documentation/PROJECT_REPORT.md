# Final Project Report — Employee Management System (EMS)

---

## 1. Project Title
**Employee Management System (EMS) — Full-Stack CRUD Web Application**

## 2. Executive Overview
The Employee Management System is a comprehensive, production-grade full-stack web application engineered to centralize, standardize, and streamline organizational workforce records. Designed to fulfill the academic Standard Operating Procedure (SOP) for CRUD-based web applications, the system demonstrates an enterprise-grade architecture: **React 19 with TypeScript, Tailwind CSS, and Framer Motion** on the frontend, interfaced through a clean REST API powered by **Python 3.14, Django 6.1, and Django REST Framework**, persisting to a normalized **SQLite 3 relational database**.

---

## 3. Problem Statement
Organizations routinely struggle with disparate, spreadsheet-based employee records. Common vulnerabilities include:
- Lack of centralized accessibility and single-source-of-truth record storage.
- Insufficient data validation, allowing duplicate IDs, malformed emails, and invalid salaries.
- Cluttered, outdated user interfaces that impede rapid searching, filtering, and updates.
- Insecure direct deletion operations prone to accidental human error.

EMS addresses each deficiency by enforcing dual-tier validation, responsive table/card layouts, live workforce analytics, and protected confirmation workflows.

---

## 4. Objectives
- Develop an asynchronous Single Page Application (SPA) with zero full-page reload friction.
- Implement genuine SQLite-backed CRUD (Create, Read, Update, Delete) capabilities.
- Enforce strict database and serializer constraints (`UNIQUE` employee_id/email, non-negative salary, controlled choices).
- Provide real-time multi-criteria filtering, live search, and dynamic sorting.
- Deliver an Apple-inspired minimalist user experience focused on clarity, restraint, and generous whitespace.
- Produce complete technical documentation, an automated test suite, and viva examination materials.

---

## 5. Technology Stack

| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Presentation** | React 19 (TypeScript) | Reactive user interface and state management |
| **Bundler** | Vite 8 | Ultra-fast Hot Module Replacement (HMR) and production bundling |
| **Styling** | Tailwind CSS v4 | Utility-first styling configured with an Apple Minimal theme |
| **Animation** | Framer Motion | Smooth, purposeful micro-interactions and dialog transitions |
| **Iconography** | Lucide React | Clean, scalable visual symbols |
| **HTTP Client** | Axios | Centralized API client with interceptors and error formatting |
| **REST API** | Django REST Framework 3.18 | API routing, serializers, request parsing, and error formatting |
| **Backend** | Python 3.14 + Django 6.1 | Web application framework, ORM, and admin console |
| **Database** | SQLite 3 | Embedded relational storage; schema portable to PostgreSQL/MySQL |
| **CORS** | `django-cors-headers` | Secure cross-origin communication between ports 5173 and 8000 |

---

## 6. System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                       Presentation Layer                        │
│   React 19 + TypeScript + Tailwind CSS (Apple Minimal Theme)    │
│   Framer Motion (Micro-interactions) + Lucide Icons             │
│   Client-Side Form Validation & Route Protection (Port 5173)    │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP / JSON (Axios)
                                 │ CORS Handshake
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        REST API Layer                           │
│   Django REST Framework (DRF) ModelViewSet + APIViews           │
│   Request Deserialization, Validation & Error Mapping (Port 8000│
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Business & Model Layer                      │
│   Django ORM (Object-Relational Mapping)                        │
│   Uniqueness Constraints, MinValueValidators, Status Choices    │
└────────────────────────────────┬────────────────────────────────┘
                                 │ SQL Statements
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Persistence Layer                         │
│   SQLite Relational Database (db.sqlite3)                       │
│   Portable Schema (Compatible with PostgreSQL / MySQL)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Database & ER Design

### Employee Entity Schema
- **`id`** (`INTEGER`, PK, Auto-increment)
- **`employee_id`** (`VARCHAR(20)`, UNIQUE, NOT NULL, Indexed)
- **`full_name`** (`VARCHAR(150)`, NOT NULL)
- **`email`** (`VARCHAR(254)`, UNIQUE, NOT NULL, Indexed)
- **`phone`** (`VARCHAR(20)`, NOT NULL)
- **`department`** (`VARCHAR(50)`, NOT NULL, Choices)
- **`designation`** (`VARCHAR(100)`, NOT NULL)
- **`salary`** (`DECIMAL(10, 2)`, NOT NULL, Checked `>= 0.00`)
- **`joining_date`** (`DATE`, NOT NULL)
- **`status`** (`VARCHAR(20)`, NOT NULL, Choices: `Active`, `Inactive`, `On Leave`)
- **`created_at`** (`DATETIME`, NOT NULL, Auto-now-add)
- **`updated_at`** (`DATETIME`, NOT NULL, Auto-now)

---

## 8. User Interface Screenshots & Analysis

### 8.1 Dashboard View
![Dashboard Overview](./screenshots/01_dashboard.png)

**Key Elements**:
- **Workforce Metrics**: 4 dynamic metric cards calculating Total Employees (10), Active Employees (8; 80% operational rate), Inactive / On Leave (2), and Distinct Departments (7).
- **Workforce by Department**: Visual distribution bars calculating staff headcount and percentage shares across divisions.
- **Recent Onboardings**: Feed of latest recruits with avatar initials, role descriptions, and status badges.
- **Quick Action Bar**: "Sync Data" trigger and "+ Add Employee" button.

---

### 8.2 Employees Directory
![Employees Directory](./screenshots/02_employees_directory.png)

**Key Elements**:
- **Compound Identity Column**: Combines employee initials in a rounded badge, full legal name, and employee code.
- **Real-Time Search & Filtering**: Multi-attribute search input, Department dropdown filter, Status dropdown filter, and Sorting control.
- **Data Table**: High-legibility rows showing Department, Role, Email, Salary, Status badges, and Action icons.
- **Action Icons**: Instant triggers for "View Details", "Edit Employee", and "Delete Employee".

---

### 8.3 System & Environment Status
![Settings and Environment](./screenshots/03_settings_environment.png)

**Key Elements**:
- **Backend Health Check**: Live handshake indicator showing connection status with `http://127.0.0.1:8000/api/`.
- **Architecture Cards**: Side-by-side technical breakdown of Frontend technologies and Backend/Persistence parameters.
- **SOP Compliance Checklist**: Verifies fulfillment of all mandatory academic criteria.

---

## 9. API Specification Summary

| Method | Endpoint | Description | Response Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/employees/` | Create a new employee record | `201 Created` |
| `GET` | `/api/employees/` | List all records (supports search, filter, sort) | `200 OK` |
| `GET` | `/api/employees/{id}/` | Retrieve single employee profile | `200 OK` |
| `PUT` | `/api/employees/{id}/` | Full update of an existing record | `200 OK` |
| `PATCH` | `/api/employees/{id}/` | Partial update of fields | `200 OK` |
| `DELETE` | `/api/employees/{id}/` | Permanently remove record | `204 No Content` |
| `GET` | `/api/dashboard/stats/` | Aggregated analytics & department breakdown | `200 OK` |
| `POST` | `/api/auth/login/` | Staff/Admin authentication | `200 OK` |

---

## 10. CRUD Implementation Highlights

1. **Create (C)**:
   - Evaluates input on client (`EmployeeFormModal`) and server (`EmployeeSerializer`).
   - Rejects duplicate IDs or emails before executing database inserts.
2. **Read (R)**:
   - Fetches paginated or full lists asynchronously.
   - Dedicated slide-over modal and `/employees/:id` route for single-record deep inspection.
3. **Update (U)**:
   - Preloads existing values into the form component.
   - Dispatches `PUT`/`PATCH` request and updates the visible row without full-page reloads.
4. **Delete (D)**:
   - Requires explicit confirmation via an accessible `ConfirmDialog`.
   - Sends HTTP `DELETE` and displays an auto-dismissing success toast.

---

## 11. Verification & Testing Results

- **Automated Backend Tests (`python manage.py test employees`)**:
  - 15 test cases executed covering CRUD, uniqueness constraints, negative salary validation, search, filter, and dashboard aggregation.
  - **Result**: `15 tests passed in 0.103s (100% pass)`.
- **Frontend Production Build (`npm run build`)**:
  - Built with TypeScript and Vite 8 in `1.01s` with **zero errors**.
- **Live Integration Verification**:
  - All endpoints successfully verified on live server with realistic payloads.

---

## 12. Challenges & Engineering Solutions

| Challenge | Root Cause | Engineering Solution |
| :--- | :--- | :--- |
| **CORS Handshake Failures** | Browser Same-Origin Policy blocking port 5173 requests to 8000 | Installed and configured `django-cors-headers` middleware with explicit origin whitelisting. |
| **Input Duplicate Race Conditions** | Concurrent submissions causing primary key collisions | Configured `unique=True` on database models paired with DRF `validate_employee_id` and `validate_email` checks. |
| **Accidental Record Deletion** | Default browsers lack graceful modal confirmations | Replaced browser `confirm()` with a custom Apple-inspired `ConfirmDialog` component using Framer Motion. |
| **Field Error Translation** | Technical DRF 400 responses difficult for end users to parse | Implemented centralized error formatter in `src/services/api.ts` mapping server validation dictionaries into field-level UI alerts. |

---

## 13. Future Enhancements
- Integration of Role-Based Access Control (RBAC) with granular operator and viewer roles.
- Automated payroll generation with pay slip export to PDF.
- Leave application and manager approval workflow.
- Document and ID verification attachment uploads via cloud storage (AWS S3).
- Production deployment with PostgreSQL on AWS / Render.

---

## 14. Repository & Academic Details
- **Project Repository**: [https://github.com/Festus12lo/Employee-Management-System.git](https://github.com/Festus12lo/Employee-Management-System.git)
- **Author**: Festus12lo (`festusneloferk@gmail.com`)
- **License**: Academic Mini-Project
