from django.db.models import Q, Count
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet providing comprehensive CRUD operations for Employee records.
    Supports querying with ?search=..., ?department=..., ?status=..., and ?ordering=...
    """
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        queryset = Employee.objects.all()

        # Search parameter (matches full_name, employee_id, email, department, designation)
        search_query = self.request.query_params.get('search', '').strip()
        if search_query:
            queryset = queryset.filter(
                Q(full_name__icontains=search_query) |
                Q(employee_id__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(department__icontains=search_query) |
                Q(designation__icontains=search_query)
            )

        # Department filter
        department = self.request.query_params.get('department', '').strip()
        if department and department != 'All':
            queryset = queryset.filter(department__iexact=department)

        # Status filter
        status_filter = self.request.query_params.get('status', '').strip()
        if status_filter and status_filter != 'All':
            queryset = queryset.filter(status__iexact=status_filter)

        # Ordering parameter
        ordering = self.request.query_params.get('ordering', '').strip()
        valid_ordering_fields = [
            'created_at', '-created_at',
            'joining_date', '-joining_date',
            'full_name', '-full_name',
            'salary', '-salary',
            'employee_id', '-employee_id'
        ]
        if ordering in valid_ordering_fields:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_at')

        return queryset


class DashboardStatsView(APIView):
    """
    API endpoint calculating live workforce statistics for the dashboard.
    """

    def get(self, request):
        total = Employee.objects.count()
        active = Employee.objects.filter(status='Active').count()
        inactive = Employee.objects.filter(status='Inactive').count()
        on_leave = Employee.objects.filter(status='On Leave').count()

        # Department breakdown
        dept_counts = (
            Employee.objects.values('department')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        departments_list = []
        for item in dept_counts:
            count = item['count']
            pct = round((count / total * 100), 1) if total > 0 else 0
            departments_list.append({
                'department': item['department'],
                'count': count,
                'percentage': pct,
            })

        # Recent 5 employees
        recent_qs = Employee.objects.order_by('-created_at')[:5]
        recent_serialized = EmployeeSerializer(recent_qs, many=True).data

        return Response({
            'total_employees': total,
            'active_employees': active,
            'inactive_employees': inactive,
            'on_leave_employees': on_leave,
            'departments_count': dept_counts.count(),
            'department_distribution': departments_list,
            'recent_employees': recent_serialized,
        }, status=status.HTTP_200_OK)


class AuthLoginView(APIView):
    """
    Authentication endpoint for staff/admin login.
    """

    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '').strip()

        if not email or not password:
            return Response(
                {'error': 'Both email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if '@' not in email:
            return Response(
                {'error': 'Please enter a valid email address.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # For academic mini-project demonstration, support demo / staff login
        return Response({
            'token': f'ems-auth-token-{abs(hash(email))}',
            'user': {
                'email': email,
                'name': email.split('@')[0].replace('.', ' ').title(),
                'role': 'Administrator'
            },
            'message': 'Authentication successful.'
        }, status=status.HTTP_200_OK)
