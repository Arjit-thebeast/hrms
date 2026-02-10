from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hrms_api.views import EmployeeViewSet, AttendanceViewSet, DashboardStatsView

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'attendance', AttendanceViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
