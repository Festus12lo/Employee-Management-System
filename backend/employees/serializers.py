import re
from decimal import Decimal
from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Employee model providing full serialization,
    field-level validation, and custom error messaging.
    """

    class Meta:
        model = Employee
        fields = [
            'id',
            'employee_id',
            'full_name',
            'email',
            'phone',
            'department',
            'designation',
            'salary',
            'joining_date',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_employee_id(self, value):
        cleaned = value.strip().upper()
        if not cleaned:
            raise serializers.ValidationError("Employee ID cannot be blank.")
        
        # Check uniqueness taking into account current instance if updating
        qs = Employee.objects.filter(employee_id__iexact=cleaned)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(f"An employee with ID '{cleaned}' already exists.")
        return cleaned

    def validate_email(self, value):
        cleaned = value.strip().lower()
        if not cleaned:
            raise serializers.ValidationError("Email address cannot be blank.")
        
        # Check email format
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, cleaned):
            raise serializers.ValidationError("Enter a valid email address.")

        # Check uniqueness taking into account current instance if updating
        qs = Employee.objects.filter(email__iexact=cleaned)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(f"An employee with email '{cleaned}' already exists.")
        return cleaned

    def validate_salary(self, value):
        if value is None:
            raise serializers.ValidationError("Salary is required.")
        if Decimal(str(value)) < Decimal('0.00'):
            raise serializers.ValidationError("Salary must be a non-negative amount.")
        return value

    def validate_phone(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Phone number cannot be blank.")
        # Ensure it has digits
        digits = re.sub(r'\D', '', cleaned)
        if len(digits) < 7:
            raise serializers.ValidationError("Phone number must contain at least 7 digits.")
        return cleaned
