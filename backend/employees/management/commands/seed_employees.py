from datetime import date
from decimal import Decimal
from django.core.management.base import BaseCommand
from employees.models import Employee


class Command(BaseCommand):
    help = "Seed the database with realistic sample employee records for demonstration."

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing employee records before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            deleted_count, _ = Employee.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Cleared {deleted_count} existing employee records."))

        sample_employees = [
            {
                "employee_id": "EMP001",
                "full_name": "Arjun Kumar",
                "email": "arjun.kumar@company.com",
                "phone": "+91 98765 43210",
                "department": "Engineering",
                "designation": "Senior Full Stack Engineer",
                "salary": Decimal("85000.00"),
                "joining_date": date(2023, 3, 15),
                "status": "Active"
            },
            {
                "employee_id": "EMP002",
                "full_name": "Priya Sharma",
                "email": "priya.sharma@company.com",
                "phone": "+91 98765 43211",
                "department": "Human Resources",
                "designation": "HR Operations Lead",
                "salary": Decimal("68000.00"),
                "joining_date": date(2022, 6, 1),
                "status": "Active"
            },
            {
                "employee_id": "EMP003",
                "full_name": "Daniel Joseph",
                "email": "daniel.joseph@company.com",
                "phone": "+91 98765 43212",
                "department": "Finance",
                "designation": "Financial Analyst",
                "salary": Decimal("72000.00"),
                "joining_date": date(2023, 1, 10),
                "status": "Active"
            },
            {
                "employee_id": "EMP004",
                "full_name": "Ananya Raj",
                "email": "ananya.raj@company.com",
                "phone": "+91 98765 43213",
                "department": "Marketing",
                "designation": "Growth Marketing Specialist",
                "salary": Decimal("64000.00"),
                "joining_date": date(2023, 8, 20),
                "status": "Active"
            },
            {
                "employee_id": "EMP005",
                "full_name": "Rahul Menon",
                "email": "rahul.menon@company.com",
                "phone": "+91 98765 43214",
                "department": "IT",
                "designation": "Cloud Systems Administrator",
                "salary": Decimal("78000.00"),
                "joining_date": date(2021, 11, 15),
                "status": "Active"
            },
            {
                "employee_id": "EMP006",
                "full_name": "Sarah Jenkins",
                "email": "sarah.jenkins@company.com",
                "phone": "+91 98765 43215",
                "department": "Engineering",
                "designation": "UI/UX Frontend Architect",
                "salary": Decimal("92000.00"),
                "joining_date": date(2022, 4, 12),
                "status": "On Leave"
            },
            {
                "employee_id": "EMP007",
                "full_name": "Vikram Seth",
                "email": "vikram.seth@company.com",
                "phone": "+91 98765 43216",
                "department": "Sales",
                "designation": "Enterprise Account Executive",
                "salary": Decimal("75000.00"),
                "joining_date": date(2023, 9, 1),
                "status": "Active"
            },
            {
                "employee_id": "EMP008",
                "full_name": "Meera Patel",
                "email": "meera.patel@company.com",
                "phone": "+91 98765 43217",
                "department": "Operations",
                "designation": "Logistics & Operations Manager",
                "salary": Decimal("70000.00"),
                "joining_date": date(2022, 2, 18),
                "status": "Inactive"
            },
            {
                "employee_id": "EMP009",
                "full_name": "Karthik Nair",
                "email": "karthik.nair@company.com",
                "phone": "+91 98765 43218",
                "department": "Engineering",
                "designation": "Backend Software Engineer",
                "salary": Decimal("62000.00"),
                "joining_date": date(2024, 2, 1),
                "status": "Active"
            },
            {
                "employee_id": "EMP010",
                "full_name": "Elena Rostova",
                "email": "elena.rostova@company.com",
                "phone": "+91 98765 43219",
                "department": "Finance",
                "designation": "Accounts Senior Officer",
                "salary": Decimal("66000.00"),
                "joining_date": date(2023, 5, 25),
                "status": "Active"
            }
        ]

        created_count = 0
        updated_count = 0
        for item in sample_employees:
            emp, created = Employee.objects.update_or_create(
                employee_id=item['employee_id'],
                defaults=item
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded database: {created_count} created, {updated_count} updated. Total employees: {Employee.objects.count()}"
        ))
