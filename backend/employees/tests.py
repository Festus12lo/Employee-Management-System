from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Employee


class EmployeeAPITests(APITestCase):
    """
    Test suite validating full CRUD functionality, uniqueness constraints,
    business validations, search/filtering, and dashboard statistics.
    """

    def setUp(self):
        self.employee1 = Employee.objects.create(
            employee_id="EMP101",
            full_name="Alice Smith",
            email="alice.smith@example.com",
            phone="1234567890",
            department="Engineering",
            designation="Software Engineer",
            salary=Decimal("60000.00"),
            joining_date="2023-01-15",
            status="Active"
        )
        self.employee2 = Employee.objects.create(
            employee_id="EMP102",
            full_name="Bob Jones",
            email="bob.jones@example.com",
            phone="9876543210",
            department="Marketing",
            designation="Marketing Manager",
            salary=Decimal("55000.00"),
            joining_date="2022-05-10",
            status="On Leave"
        )
        self.list_url = reverse('employee-list')
        self.detail_url = reverse('employee-detail', kwargs={'pk': self.employee1.pk})
        self.stats_url = reverse('dashboard-stats')

    # --- 1. READ LIST ---
    def test_get_employee_list(self):
        """Test retrieving list of all employees."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    # --- 2. READ SINGLE ---
    def test_get_single_employee(self):
        """Test retrieving a single employee by ID."""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['employee_id'], "EMP101")
        self.assertEqual(response.data['full_name'], "Alice Smith")

    def test_get_non_existent_employee(self):
        """Test 404 response for non-existent employee ID."""
        url = reverse('employee-detail', kwargs={'pk': 99999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # --- 3. CREATE (Valid) ---
    def test_create_employee_success(self):
        """Test successfully creating a new employee with valid payload."""
        payload = {
            "employee_id": "EMP103",
            "full_name": "Charlie Brown",
            "email": "charlie.brown@example.com",
            "phone": "5551234567",
            "department": "Finance",
            "designation": "Financial Analyst",
            "salary": "70000.00",
            "joining_date": "2023-09-01",
            "status": "Active"
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 3)
        self.assertEqual(response.data['employee_id'], "EMP103")

    # --- 4. CREATE VALIDATION: DUPLICATE EMPLOYEE ID ---
    def test_create_duplicate_employee_id(self):
        """Test rejection when employee_id is already taken."""
        payload = {
            "employee_id": "EMP101",  # duplicate of employee1
            "full_name": "Duplicate ID Person",
            "email": "diff.email@example.com",
            "phone": "5551234567",
            "department": "IT",
            "designation": "Sysadmin",
            "salary": "50000.00",
            "joining_date": "2023-09-01",
            "status": "Active"
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('employee_id', response.data)

    # --- 5. CREATE VALIDATION: DUPLICATE EMAIL ---
    def test_create_duplicate_email(self):
        """Test rejection when email is already registered."""
        payload = {
            "employee_id": "EMP999",
            "full_name": "Duplicate Email Person",
            "email": "alice.smith@example.com",  # duplicate of employee1
            "phone": "5551234567",
            "department": "IT",
            "designation": "Developer",
            "salary": "50000.00",
            "joining_date": "2023-09-01",
            "status": "Active"
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    # --- 6. CREATE VALIDATION: INVALID SALARY (NEGATIVE) ---
    def test_create_negative_salary(self):
        """Test rejection when salary is negative."""
        payload = {
            "employee_id": "EMP104",
            "full_name": "Negative Salary Person",
            "email": "negative.salary@example.com",
            "phone": "5551234567",
            "department": "Engineering",
            "designation": "Engineer",
            "salary": "-500.00",
            "joining_date": "2023-09-01",
            "status": "Active"
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('salary', response.data)

    # --- 7. CREATE VALIDATION: MISSING REQUIRED FIELDS ---
    def test_create_missing_required_fields(self):
        """Test rejection when required fields are missing."""
        payload = {
            "employee_id": "EMP105",
            # missing full_name, email, phone, etc.
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('full_name', response.data)
        self.assertIn('email', response.data)

    # --- 8. UPDATE (PUT & PATCH) ---
    def test_update_employee_put(self):
        """Test full update via PUT."""
        payload = {
            "employee_id": "EMP101",
            "full_name": "Alice Smith Updated",
            "email": "alice.updated@example.com",
            "phone": "1234567899",
            "department": "Engineering",
            "designation": "Lead Architect",
            "salary": "85000.00",
            "joining_date": "2023-01-15",
            "status": "Active"
        }
        response = self.client.put(self.detail_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.employee1.refresh_from_db()
        self.assertEqual(self.employee1.full_name, "Alice Smith Updated")
        self.assertEqual(self.employee1.designation, "Lead Architect")
        self.assertEqual(self.employee1.salary, Decimal("85000.00"))

    def test_partial_update_employee_patch(self):
        """Test partial update via PATCH."""
        payload = {"designation": "Principal Engineer", "status": "Inactive"}
        response = self.client.patch(self.detail_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.employee1.refresh_from_db()
        self.assertEqual(self.employee1.designation, "Principal Engineer")
        self.assertEqual(self.employee1.status, "Inactive")

    # --- 9. DELETE ---
    def test_delete_employee(self):
        """Test deleting an employee."""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Employee.objects.filter(pk=self.employee1.pk).exists())
        self.assertEqual(Employee.objects.count(), 1)

    # --- 10. SEARCH & FILTERING ---
    def test_search_employees(self):
        """Test search by name, id, and designation."""
        response = self.client.get(self.list_url + '?search=Alice')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['employee_id'], "EMP101")

        response = self.client.get(self.list_url + '?search=EMP102')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['full_name'], "Bob Jones")

    def test_filter_by_department(self):
        """Test filtering by department."""
        response = self.client.get(self.list_url + '?department=Marketing')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['full_name'], "Bob Jones")

    def test_filter_by_status(self):
        """Test filtering by status."""
        response = self.client.get(self.list_url + '?status=On Leave')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['employee_id'], "EMP102")

    # --- 11. DASHBOARD STATS ---
    def test_dashboard_stats(self):
        """Test dashboard statistics calculation endpoint."""
        response = self.client.get(self.stats_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_employees'], 2)
        self.assertEqual(response.data['active_employees'], 1)
        self.assertEqual(response.data['inactive_employees'], 0)
        self.assertEqual(response.data['on_leave_employees'], 1)
        self.assertEqual(response.data['departments_count'], 2)
        self.assertEqual(len(response.data['recent_employees']), 2)
