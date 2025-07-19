from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from .views import (AppointmentListCreateView, AppointmentUpdateView,
                    CustomAppointmentRequestCreateView,
                    CustomAppointmentRequestListView,
                    CustomAppointmentRequestUpdateView,
                    DoctorCustomAppointmentRequestListView, DoctorListView,
                    PrescriptionCreateView, PrescriptionDetailView,
                    PrescriptionUpdateView, ProfileView, UserRegistrationView,
                    doctor_appointment_summary, my_appointments,
                    prescription_pdf_view, upcoming_appointment_notification,
                     PatientCustomAppointmentRequestListView,)

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
   path('upcoming-appointment-notification/', upcoming_appointment_notification, name='upcoming-appointment-notification'),
   path('appointments/<int:pk>/edit/', AppointmentUpdateView.as_view(), name='appointment-update'),
   path('doctor/appointment-summary/', doctor_appointment_summary, name='doctor-appointment-summary'),
   path('my-appointments/', my_appointments, name='my-appointments'),
   path('custom-appointment-request/', CustomAppointmentRequestCreateView.as_view(), name='custom-appointment-request-create'),
   path('custom-appointment-requests/', CustomAppointmentRequestListView.as_view(), name='custom-appointment-request-list'),
   path('doctor/custom-appointment-requests/', DoctorCustomAppointmentRequestListView.as_view(), name='doctor-custom-appointment-request-list'),
   path('custom-appointment-request/<int:pk>/', CustomAppointmentRequestUpdateView.as_view(), name='custom-appointment-request-update'),
   path('patient/custom-appointment-requests/', PatientCustomAppointmentRequestListView.as_view(), name='patient-custom-appointment-request-list'),
]