from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from .views import (AppointmentListCreateView, DoctorListView,
                    PrescriptionCreateView, PrescriptionDetailView,
                    PrescriptionUpdateView, ProfileView, UserRegistrationView,
                    prescription_pdf_view)

urlpatterns = [
   path('register/', UserRegistrationView.as_view(), name='register'),
   path('profile/', ProfileView.as_view(), name='profile'),
   path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
   path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
   path('appointments/', AppointmentListCreateView.as_view(), name='appointments'),
   path('doctors/', DoctorListView.as_view(), name='doctor-list'),
   path('prescriptions/', PrescriptionCreateView.as_view(), name='prescription-create'),
   #path('prescriptions/<int:appointment>/', PrescriptionDetailView.as_view(), name='prescription-detail'),
   path('prescriptions/<int:appointment>/pdf/', prescription_pdf_view, name='prescription-pdf'),
   #path('prescriptions/<int:pk>/', PrescriptionUpdateView.as_view(), name='prescription-update'),
   path('prescriptions/<int:pk>/edit/', PrescriptionUpdateView.as_view(), name='prescription-update'),
   path('prescriptions/<int:appointment>/', PrescriptionDetailView.as_view(), name='prescription-detail'),
]