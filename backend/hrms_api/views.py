from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Q
from datetime import datetime

from .models import Employee, AttendanceRecord
from .serializers import EmployeeSerializer, AttendanceSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if employee ID already exists
        if Employee.objects.filter(id=request.data.get('id')).exists():
            return Response(
                {'error': 'Employee ID already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        employee_id = self.kwargs.get('pk')
        # Also delete related attendance records
        AttendanceRecord.objects.filter(employeeId=employee_id).delete()
        return super().destroy(request, *args, **kwargs)


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        date = self.request.query_params.get('date')
        if date:
            return AttendanceRecord.objects.filter(date=date)
        return AttendanceRecord.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data
        employee_id = data.get('employeeId')
        date = data.get('date')

        # Check if record already exists
        existing = AttendanceRecord.objects.filter(
            employeeId=employee_id,
            date=date
        ).first()

        if existing:
            # Update existing record
            serializer = self.get_serializer(existing, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

        # Create new record
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DashboardStatsView(APIView):
    def get(self, request):
        today = datetime.now().date().isoformat()
        
        employees = Employee.objects.all()
        today_attendance = AttendanceRecord.objects.filter(date=today)

        total_employees = employees.count()
        present_today = today_attendance.filter(status='Present').count()
        absent_today = today_attendance.filter(status='Absent').count()

        # Department counts
        department_counts = {}
        for emp in employees:
            dept = emp.department
            department_counts[dept] = department_counts.get(dept, 0) + 1

        stats = {
            'totalEmployees': total_employees,
            'presentToday': present_today,
            'absentToday': absent_today,
            'departmentCounts': department_counts
        }

        return Response(stats)
