# Comprehensive Viva Voce & Defense Guide

This guide is curated specifically for viva examinations, project presentations, and academic evaluations. It provides clear, confident, and technically precise answers to the most common questions.

---

### Q1: What is the overall architecture of this project?
**Answer**:  
The system follows a decoupled multi-tier architecture:
- **Presentation Layer**: React 19 + TypeScript + Tailwind CSS (Single Page Application) running in the client's browser.
- **REST API Layer**: Django REST Framework (DRF) handling HTTP routing, request parsing, and error formatting.
- **Business/ORM Layer**: Django Object-Relational Mapper (ORM) enforcing model validations and business rules.
- **Persistence Layer**: SQLite relational database storing normalized employee records.

---

### Q2: What is a REST API and how is it used here?
**Answer**:  
REST (Representational State Transfer) is an architectural style for network-based applications that uses standard HTTP verbs to manipulate resources represented in JSON format.
In our application:
- `GET /api/employees/` retrieves employees.
- `POST /api/employees/` creates a new employee.
- `PUT` / `PATCH /api/employees/{id}/` updates an employee.
- `DELETE /api/employees/{id}/` removes an employee.
- `GET /api/dashboard/stats/` returns aggregated metrics.

---

### Q3: What does CRUD stand for and where is it implemented?
**Answer**:  
CRUD stands for **Create, Read, Update, and Delete**.
- **Create**: Implemented via `POST /api/employees/`, triggered by the "Add Employee" modal.
- **Read**: Implemented via `GET /api/employees/` (list/table) and `GET /api/employees/{id}/` (slide-over detail view).
- **Update**: Implemented via `PUT` and `PATCH /api/employees/{id}/`, triggered by the "Edit Employee" form.
- **Delete**: Implemented via `DELETE /api/employees/{id}/`, triggered after user confirms the action in the custom modal dialog.

---

### Q4: How does the React Frontend communicate with the Django Backend?
**Answer**:  
React communicates with Django asynchronously using the **Axios** HTTP client library. When a user interacts with the UI (e.g., clicking "Add Employee"), Axios sends an asynchronous HTTP request with a JSON payload to the Django server (`http://127.0.0.1:8000/api/`). Django receives the request, processes it, queries the database, and returns a JSON response with an appropriate HTTP status code (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

---

### Q5: What is CORS and why is it necessary?
**Answer**:  
CORS stands for **Cross-Origin Resource Sharing**. Browsers enforce the Same-Origin Policy, preventing a frontend on `http://localhost:5173` from accessing resources on `http://127.0.0.1:8000` unless the backend explicitly grants permission. We configured `django-cors-headers` in `settings.py` to allow the React development origin.

---

### Q6: What does the Django ORM do and how does it talk to SQLite?
**Answer**:  
The Django ORM (Object-Relational Mapper) bridges Python code and the SQL database. Instead of writing raw SQL queries like `SELECT * FROM employees WHERE department = 'Engineering'`, we write Python queries like `Employee.objects.filter(department='Engineering')`. The ORM safely translates these method calls into parameterized SQL queries executed against SQLite, preventing SQL injection vulnerabilities.

---

### Q7: How does validation work in this project?
**Answer**:  
We implemented **dual-tier validation**:
1. **Frontend Validation (React)**:
   - Validates that mandatory fields are non-empty before sending the request.
   - Regex check for valid email format (`user@domain.com`).
   - Checks that salary is non-negative and phone has sufficient digits.
   - Provides immediate, accessible visual feedback to the user.
2. **Backend Validation (Django & DRF Serializer)**:
   - Enforces database-level constraints: `unique=True` on `employee_id` and `email`.
   - `MinValueValidator(0.00)` on `salary`.
   - Field-level serializer methods (`validate_employee_id`, `validate_email`, `validate_salary`).
   - Ensures data integrity even if the client-side checks are bypassed or an API tool like Postman is used.

---

### Q8: How does search and filtering work without full page reloads?
**Answer**:  
In the frontend, filter state (`search`, `department`, `status`, `ordering`) is held in React state. Whenever the user types or selects a dropdown, React updates state and dispatches an Axios call to `GET /api/employees/?search=...&department=...`. Django's `EmployeeViewSet.get_queryset()` applies Q-object filters across full name, ID, email, and department. The response updates the component's `employees` array in memory, re-rendering only the table rows smoothly without refreshing the browser.

---

### Q9: How is the delete workflow made safe and user-friendly?
**Answer**:  
To prevent accidental data loss, the application does not delete records immediately, nor does it use primitive browser `window.confirm()`. Instead, clicking "Delete" opens a custom, accessible **ConfirmDialog** explaining that the deletion is permanent. Upon confirmation, a `DELETE` request is sent, the row is removed from state, a success toast notification appears, and the dashboard statistics update automatically.

---

### Q10: How could this application be deployed to production?
**Answer**:  
1. **Frontend**: Build production bundle via `npm run build` (outputs optimized static files in `dist/`) and host on Vercel, Netlify, or AWS S3 + CloudFront.
2. **Backend**: Run Django with Gunicorn or Uwsgi behind an Nginx reverse proxy on an AWS EC2 instance, Render, or DigitalOcean Droplet.
3. **Database**: Switch `settings.DATABASES` from SQLite to managed PostgreSQL or MySQL with environment variables for credentials.
