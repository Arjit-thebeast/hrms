from django.db import models

DEPARTMENT_CHOICES = [
    ('Engineering', 'Engineering'),
    ('Human Resources', 'Human Resources'),
    ('Marketing', 'Marketing'),
    ('Sales', 'Sales'),
    ('Finance', 'Finance'),
    ('Operations', 'Operations'),
]

ATTENDANCE_STATUS_CHOICES = [
    ('Present', 'Present'),
    ('Absent', 'Absent'),
]


class Employee(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    fullName = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-createdAt']

    def __str__(self):
        return self.fullName


class AttendanceRecord(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    employeeId = models.CharField(max_length=50)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=ATTENDANCE_STATUS_CHOICES)

    class Meta:
        ordering = ['-date']
        constraints = [
            models.UniqueConstraint(
                fields=['employeeId', 'date'],
                name='unique_employee_date'
            )
        ]

    def __str__(self):
        return f"{self.employeeId} - {self.date}: {self.status}"
