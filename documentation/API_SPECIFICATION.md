# REST API Specification

**Base URL**: `http://127.0.0.1:8000/api`  
**Content-Type**: `application/json`  
**Authentication**: Bearer Token (Optional for read operations, standard header for staff sessions)

---

## Summary of Endpoints

| Verb | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/employees/` | Create a new employee record | `201 Created` |
| `GET` | `/api/employees/` | Retrieve all employees (supports search & filter) | `200 OK` |
| `GET` | `/api/employees/{id}/` | Retrieve a single employee by primary key | `200 OK` |
| `PUT` | `/api/employees/{id}/` | Full update of an employee record | `200 OK` |
| `PATCH` | `/api/employees/{id}/` | Partial update of an employee record | `200 OK` |
| `DELETE` | `/api/employees/{id}/` | Permanently remove an employee record | `204 No Content` |
| `GET` | `/api/dashboard/stats/` | Retrieve live aggregated workforce statistics | `200 OK` |
| `POST` | `/api/auth/login/` | Staff/Admin login and authentication | `200 OK` |

---

## 1. Create Employee
`POST /api/employees/`

Creates a new employee record. Enforces server-side field presence, valid email format, positive salary, and uniqueness of `employee_id` and `email`.

### Request Body
```json
{
  "employee_id": "EMP011",
  "full_name": "Rohan Deshmukh",
  "email": "rohan.deshmukh@company.com",
  "phone": "+91 98765 43220",
  "department": "Engineering",
  "designation": "DevOps Engineer",
  "salary": "72000.00",
  "joining_date": "2024-03-01",
  "status": "Active"
}
```

### Successful Response (`201 Created`)
```json
{
  "id": 11,
  "employee_id": "EMP011",
  "full_name": "Rohan Deshmukh",
  "email": "rohan.deshmukh@company.com",
  "phone": "+91 98765 43220",
  "department": "Engineering",
  "designation": "DevOps Engineer",
  "salary": "72000.00",
  "joining_date": "2024-03-01",
  "status": "Active",
  "created_at": "2026-09-17 19:15:00",
  "updated_at": "2026-09-17 19:15:00"
}
```

### Error Response (`400 Bad Request`)
```json
{
  "employee_id": ["An employee with ID 'EMP011' already exists."],
  "salary": ["Salary must be a non-negative amount."]
}
```

---

## 2. Read All Employees
`GET /api/employees/`

Retrieves a list of employee records.

### Query Parameters
- `search` *(string)*: Searches across `full_name`, `employee_id`, `email`, `department`, and `designation`.
- `department` *(string)*: Filters by department (e.g. `Engineering`, `Human Resources`, `Finance`).
- `status` *(string)*: Filters by status (`Active`, `Inactive`, `On Leave`).
- `ordering` *(string)*: Sorts records (`-created_at`, `created_at`, `full_name`, `-full_name`, `-salary`, `salary`, `-joining_date`).

### Example Request
```http
GET /api/employees/?department=Engineering&status=Active&ordering=-salary
```

### Response (`200 OK`)
```json
[
  {
    "id": 6,
    "employee_id": "EMP006",
    "full_name": "Sarah Jenkins",
    "email": "sarah.jenkins@company.com",
    "phone": "+91 98765 43215",
    "department": "Engineering",
    "designation": "UI/UX Frontend Architect",
    "salary": "92000.00",
    "joining_date": "2022-04-12",
    "status": "Active",
    "created_at": "2026-09-17 18:00:00",
    "updated_at": "2026-09-17 18:00:00"
  }
]
```

---

## 3. Read Single Employee
`GET /api/employees/{id}/`

### Response (`200 OK`)
```json
{
  "id": 1,
  "employee_id": "EMP001",
  "full_name": "Arjun Kumar",
  "email": "arjun.kumar@company.com",
  "phone": "+91 98765 43210",
  "department": "Engineering",
  "designation": "Senior Full Stack Engineer",
  "salary": "85000.00",
  "joining_date": "2023-03-15",
  "status": "Active",
  "created_at": "2026-09-17 18:00:00",
  "updated_at": "2026-09-17 18:00:00"
}
```

### Error Response (`404 Not Found`)
```json
{
  "detail": "No Employee matches the given query."
}
```

---

## 4. Update Employee
`PUT /api/employees/{id}/` (Full replacement)  
`PATCH /api/employees/{id}/` (Partial update)

### Example Request (`PUT /api/employees/1/`)
```json
{
  "employee_id": "EMP001",
  "full_name": "Arjun Kumar",
  "email": "arjun.kumar@company.com",
  "phone": "+91 98765 43210",
  "department": "Engineering",
  "designation": "Principal Architect",
  "salary": "95000.00",
  "joining_date": "2023-03-15",
  "status": "Active"
}
```

### Response (`200 OK`)
Returns the complete updated employee object.

---

## 5. Delete Employee
`DELETE /api/employees/{id}/`

Permanently deletes the employee record.

### Response (`204 No Content`)
Empty body.

---

## 6. Live Dashboard Statistics
`GET /api/dashboard/stats/`

Computes live workforce numbers for cards, distribution charts, and recent activity.

### Response (`200 OK`)
```json
{
  "total_employees": 10,
  "active_employees": 8,
  "inactive_employees": 1,
  "on_leave_employees": 1,
  "departments_count": 6,
  "department_distribution": [
    { "department": "Engineering", "count": 3, "percentage": 30.0 },
    { "department": "Finance", "count": 2, "percentage": 20.0 },
    { "department": "Human Resources", "count": 1, "percentage": 10.0 },
    { "department": "Marketing", "count": 1, "percentage": 10.0 },
    { "department": "IT", "count": 1, "percentage": 10.0 },
    { "department": "Sales", "count": 1, "percentage": 10.0 },
    { "department": "Operations", "count": 1, "percentage": 10.0 }
  ],
  "recent_employees": [ ... ]
}
```

---

## 7. Staff Authentication
`POST /api/auth/login/`

### Request Body
```json
{
  "email": "admin@company.com",
  "password": "adminpassword123"
}
```

### Response (`200 OK`)
```json
{
  "token": "ems-auth-token-12345678",
  "user": {
    "email": "admin@company.com",
    "name": "Admin",
    "role": "Administrator"
  },
  "message": "Authentication successful."
}
```
