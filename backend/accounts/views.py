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
    UserRegistrationSerializer  # You can reuse or create a new serializer


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


# backend/accounts/views.py

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
    lookup_field = 'pk'  # default, so /prescriptions/<id>/

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


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.response import Response

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
    # You may want to filter by timeslot as well for more accuracy
    if appointments.exists():
        return Response({'notify': True, 'appointments': AppointmentSerializer(appointments, many=True).data})
    return Response({'notify': False})