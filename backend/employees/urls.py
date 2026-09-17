from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, DashboardStatsView, AuthLoginView

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('auth/login/', AuthLoginView.as_view(), name='auth-login'),
    path('', include(router.urls)),
]
