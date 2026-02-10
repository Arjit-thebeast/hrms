from django.contrib import admin
from .models import Employee, AttendanceRecord


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['id', 'fullName', 'email', 'department', 'createdAt']
    search_fields = ['fullName', 'email', 'id']
    list_filter = ['department', 'createdAt']


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'employeeId', 'date', 'status']
    search_fields = ['employeeId', 'id']
    list_filter = ['date', 'status']
