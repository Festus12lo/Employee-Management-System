from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'employee_id',
        'full_name',
        'email',
        'department',
        'designation',
        'salary',
        'status',
        'joining_date',
    )
    list_filter = ('department', 'status', 'joining_date')
    search_fields = ('employee_id', 'full_name', 'email', 'department', 'designation')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'email', 'phone')
        }),
        ('Employment Details', {
            'fields': ('employee_id', 'department', 'designation', 'salary', 'joining_date', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
