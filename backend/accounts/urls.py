from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from .views import AppointmentListCreateView, ProfileView, UserRegistrationView,DoctorListView

urlpatterns = [
   path('register/', UserRegistrationView.as_view(), name='register'),
   path('profile/', ProfileView.as_view(), name='profile'),
   path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
   path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
   path('appointments/', AppointmentListCreateView.as_view(), name='appointments'),
   path('doctors/', DoctorListView.as_view(), name='doctor-list'),
]