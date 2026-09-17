# Database Schema & Entity-Relationship Design

## 1. Entity-Relationship (ER) Model

```text
┌─────────────────────────────────────────────────────────────┐
│                          EMPLOYEE                           │
├───────────────────┬───────────────────┬─────────────────────┤
│ Field Name        │ Data Type         │ Constraints         │
├───────────────────┼───────────────────┼─────────────────────┤
│ id                │ INTEGER           │ PRIMARY KEY, AUTO   │
│ employee_id       │ VARCHAR(20)       │ UNIQUE, NOT NULL    │
│ full_name         │ VARCHAR(150)      │ NOT NULL            │
│ email             │ VARCHAR(254)      │ UNIQUE, NOT NULL    │
│ phone             │ VARCHAR(20)       │ NOT NULL            │
│ department        │ VARCHAR(50)       │ NOT NULL, CHOICES   │
│ designation       │ VARCHAR(100)      │ NOT NULL            │
│ salary            │ DECIMAL(10, 2)    │ NOT NULL, >= 0.00   │
│ joining_date      │ DATE              │ NOT NULL            │
│ status            │ VARCHAR(20)       │ NOT NULL, DEFAULT   │
│ created_at        │ DATETIME          │ NOT NULL, AUTO_NOW  │
│ updated_at        │ DATETIME          │ NOT NULL, AUTO_NOW  │
└───────────────────┴───────────────────┴─────────────────────┘
```

---

## 2. Table Definition & Constraint Rules

| Column | Python / ORM Type | SQL Column Type | Nullable | Indexed | Key / Constraint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `AutoField` | `INTEGER` | `NO` | `YES` | Primary Key |
| `employee_id` | `CharField(max_length=20)` | `VARCHAR(20)` | `NO` | `YES` | Unique identifier (e.g., `EMP001`) |
| `full_name` | `CharField(max_length=150)` | `VARCHAR(150)` | `NO` | `NO` | Employee's full legal name |
| `email` | `EmailField(max_length=254)` | `VARCHAR(254)` | `NO` | `YES` | Unique, validated email address |
| `phone` | `CharField(max_length=20)` | `VARCHAR(20)` | `NO` | `NO` | Contact telephone number |
| `department` | `CharField(max_length=50)` | `VARCHAR(50)` | `NO` | `NO` | Controlled choices |
| `designation` | `CharField(max_length=100)` | `VARCHAR(100)` | `NO` | `NO` | Job title or position |
| `salary` | `DecimalField(10, 2)` | `NUMERIC(10, 2)` | `NO` | `NO` | Checked non-negative: `salary >= 0` |
| `joining_date` | `DateField` | `DATE` | `NO` | `NO` | Date of joining |
| `status` | `CharField(max_length=20)` | `VARCHAR(20)` | `NO` | `NO` | Choices: `Active`, `Inactive`, `On Leave` |
| `created_at` | `DateTimeField(auto_now_add=True)` | `DATETIME` | `NO` | `NO` | Creation timestamp |
| `updated_at` | `DateTimeField(auto_now=True)` | `DATETIME` | `NO` | `NO` | Last modification timestamp |

---

## 3. Department & Status Controlled Choices

### Departments
1. `Engineering`
2. `IT`
3. `Human Resources`
4. `Finance`
5. `Marketing`
6. `Sales`
7. `Operations`

### Employment Statuses
1. `Active`
2. `Inactive`
3. `On Leave`

---

## 4. Production Database Migration (PostgreSQL / MySQL)
The persistence layer was explicitly designed to migrate seamlessly from SQLite to PostgreSQL or MySQL with **zero code changes**:

### Step 1: Install Driver
```bash
# For PostgreSQL:
pip install psycopg2-binary

# For MySQL:
pip install mysqlclient
```

### Step 2: Update `backend/config/settings.py`
```python
# PostgreSQL Configuration Example:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'ems_db',
        'USER': 'ems_user',
        'PASSWORD': 'your_secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Step 3: Run Migrations
```bash
python manage.py migrate
python manage.py seed_employees
```
All constraints (uniqueness, decimal precision, indexes, and not-null constraints) are automatically mapped by Django ORM to the target database engine.
