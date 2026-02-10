from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('fullName', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('department', models.CharField(choices=[('Engineering', 'Engineering'), ('Human Resources', 'Human Resources'), ('Marketing', 'Marketing'), ('Sales', 'Sales'), ('Finance', 'Finance'), ('Operations', 'Operations')], max_length=50)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-createdAt'],
            },
        ),
        migrations.CreateModel(
            name='AttendanceRecord',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('employeeId', models.CharField(max_length=50)),
                ('date', models.DateField()),
                ('status', models.CharField(choices=[('Present', 'Present'), ('Absent', 'Absent')], max_length=20)),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
        migrations.AddConstraint(
            model_name='attendancerecord',
            constraint=models.UniqueConstraint(fields=['employeeId', 'date'], name='unique_employee_date'),
        ),
    ]
