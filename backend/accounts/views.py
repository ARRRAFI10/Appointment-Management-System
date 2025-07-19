from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
# Create your views here.
from rest_framework.views import APIView

from .serializers import UserRegistrationSerializer


class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import \
    UserRegistrationSerializer  


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserRegistrationSerializer(request.user)
        return Response(serializer.data)


from rest_framework import generics, permissions

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentListCreateView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'doctor':
            return Appointment.objects.filter(doctor=user)
        elif user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        return Appointment.objects.all()

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

from rest_framework import generics, permissions

from .models import CustomUser
from .serializers import DoctorListSerializer


class DoctorListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(user_type='doctor')
    serializer_class = DoctorListSerializer
    permission_classes = [permissions.IsAuthenticated]




from rest_framework import generics, permissions

from .models import Prescription
from .serializers import PrescriptionSerializer


class PrescriptionCreateView(generics.CreateAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        appointment = serializer.validated_data['appointment']
        serializer.save(doctor=self.request.user, patient=appointment.patient)

class PrescriptionDetailView(generics.RetrieveAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'appointment'
    
from rest_framework import generics, permissions

from .models import Prescription
from .serializers import PrescriptionSerializer


class PrescriptionUpdateView(generics.UpdateAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk' 

from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa


def prescription_pdf_view(request, appointment):
    prescription = Prescription.objects.get(appointment_id=appointment)
    template = get_template('prescription_pdf.html')
    html = template.render({'prescription': prescription})
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'filename=prescription_{appointment}.pdf'
    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse('We had some errors <pre>' + html + '</pre>')
    return response


from datetime import timedelta

from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Appointment
from .serializers import AppointmentSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_appointment_notification(request):
    now = timezone.now()
    next_24h = now + timedelta(hours=24)
    appointments = Appointment.objects.filter(
        patient=request.user,
        appointment_date__gte=now.date(),
        appointment_date__lte=next_24h.date()
    )
    
    if appointments.exists():
        return Response({'notify': True, 'appointments': AppointmentSerializer(appointments, many=True).data})
    return Response({'notify': False})


from rest_framework import generics, permissions

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentUpdateView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'


import calendar
from datetime import datetime, timedelta

from django.db.models import Count, Q, Sum
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Appointment


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_appointment_summary(request):
    user = request.user
    if user.user_type != 'doctor':
        return Response({'detail': 'Only doctors can access this.'}, status=403)

    
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    now = timezone.now().date()

    
    first_day_this_month = now.replace(day=1)
    last_day_this_month = now.replace(day=calendar.monthrange(now.year, now.month)[1])

   
    first_day_last_month = (first_day_this_month - timedelta(days=1)).replace(day=1)
    last_day_last_month = first_day_this_month - timedelta(days=1)

    
    first_day_this_year = now.replace(month=1, day=1)
    last_day_this_year = now.replace(month=12, day=31)

    
    first_day_last_year = (first_day_this_year - timedelta(days=1)).replace(month=1, day=1)
    last_day_last_year = first_day_this_year - timedelta(days=1)

    
    def get_stats(qs):
        completed = qs.filter(status='completed')
        pending = qs.filter(status='pending')
        return {
            'total_completed': completed.count(),
            'total_pending': pending.count(),
            'total_earned': completed.aggregate(
                earned=Sum('doctor__consultation_fee')
            )['earned'] or 0
        }

    
    appts = Appointment.objects.filter(doctor=user)

    
    last_year_stats = get_stats(appts.filter(
        appointment_date__gte=first_day_last_year,
        appointment_date__lte=last_day_last_year
    ))
    last_month_stats = get_stats(appts.filter(
        appointment_date__gte=first_day_last_month,
        appointment_date__lte=last_day_last_month
    ))
    this_month_stats = get_stats(appts.filter(
        appointment_date__gte=first_day_this_month,
        appointment_date__lte=last_day_this_month
    ))
    this_year_stats = get_stats(appts.filter(
        appointment_date__gte=first_day_this_year,
        appointment_date__lte=last_day_this_year
    ))

    
    filtered_stats = None
    if start_date and end_date:
        filtered_stats = get_stats(appts.filter(
            appointment_date__gte=start_date,
            appointment_date__lte=end_date
        ))

    return Response({
        'last_year': last_year_stats,
        'last_month': last_month_stats,
        'this_month': this_month_stats,
        'this_year': this_year_stats,
        'filtered': filtered_stats
    })


from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Appointment
from .serializers import AppointmentSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_appointments(request):
    user = request.user
    now = timezone.now()
    
    upcoming = Appointment.objects.filter(patient=user, appointment_date__gte=now).order_by('appointment_date')
    past = Appointment.objects.filter(patient=user, appointment_date__lt=now).order_by('-appointment_date')
    return Response({
        'upcoming': AppointmentSerializer(upcoming, many=True).data,
        'past': AppointmentSerializer(past, many=True).data,
    })


from rest_framework import generics, permissions

from .models import CustomAppointmentRequest
from .serializers import CustomAppointmentRequestSerializer






class CustomAppointmentRequestCreateView(generics.CreateAPIView):
    serializer_class = CustomAppointmentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


class CustomAppointmentRequestListView(generics.ListAPIView):
    queryset = CustomAppointmentRequest.objects.all().order_by('-created_at')
    serializer_class = CustomAppointmentRequestSerializer
    permission_classes = [permissions.IsAdminUser]


class DoctorCustomAppointmentRequestListView(generics.ListAPIView):
    serializer_class = CustomAppointmentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CustomAppointmentRequest.objects.filter(doctor=self.request.user).order_by('-created_at')


class CustomAppointmentRequestUpdateView(generics.UpdateAPIView):
    queryset = CustomAppointmentRequest.objects.all()
    serializer_class = CustomAppointmentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def perform_update(self, serializer):
        instance = serializer.save()
        
        if instance.status == 'doctor_approved':
            from .models import Appointment

            
            exists = Appointment.objects.filter(
                patient=instance.patient,
                doctor=instance.doctor,
                appointment_date=instance.desired_date,
                timeslot=instance.desired_timeslot
            ).exists()
            if not exists:
                Appointment.objects.create(
                    patient=instance.patient,
                    doctor=instance.doctor,
                    appointment_date=instance.desired_date,
                    timeslot=instance.desired_timeslot,
                    notes=instance.reason,
                    status='confirmed'
                )

from rest_framework import generics, permissions

from .models import CustomAppointmentRequest
from .serializers import CustomAppointmentRequestSerializer


class PatientCustomAppointmentRequestListView(generics.ListAPIView):
    serializer_class = CustomAppointmentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CustomAppointmentRequest.objects.filter(patient=self.request.user).order_by('-created_at')