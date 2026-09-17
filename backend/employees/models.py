from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator


class Employee(models.Model):
    """
    Employee entity representing organizational workforce records.
    Designed for SQLite with clean constraints for seamless PostgreSQL/MySQL portability.
    """

    DEPARTMENT_CHOICES = [
        ('Engineering', 'Engineering'),
        ('IT', 'IT'),
        ('Human Resources', 'Human Resources'),
        ('Finance', 'Finance'),
        ('Marketing', 'Marketing'),
        ('Sales', 'Sales'),
        ('Operations', 'Operations'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('On Leave', 'On Leave'),
    ]

    employee_id = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        help_text="Unique company employee identifier (e.g., EMP001)"
    )
    full_name = models.CharField(
        max_length=150,
        help_text="Full legal name of the employee"
    )
    email = models.EmailField(
        unique=True,
        db_index=True,
        help_text="Work or primary email address"
    )
    phone = models.CharField(
        max_length=20,
        help_text="Contact telephone number"
    )
    department = models.CharField(
        max_length=50,
        choices=DEPARTMENT_CHOICES,
        help_text="Primary department"
    )
    designation = models.CharField(
        max_length=100,
        help_text="Job title / role designation"
    )
    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Monthly or annual base compensation (must be non-negative)"
    )
    joining_date = models.DateField(
        help_text="Date employee joined the organization"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Active',
        help_text="Current employment status"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when record was last updated"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'

    def __str__(self):
        return f"{self.employee_id} - {self.full_name} ({self.department})"
