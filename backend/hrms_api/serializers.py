from rest_framework import serializers
from .models import Employee, AttendanceRecord


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'fullName', 'email', 'department', 'createdAt']
        read_only_fields = ['createdAt']


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = ['id', 'employeeId', 'date', 'status']
