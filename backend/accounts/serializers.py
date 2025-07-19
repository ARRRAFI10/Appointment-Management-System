import re

from rest_framework import serializers

from .models import Appointment, CustomUser, Prescription


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = [
            'full_name', 'email', 'mobile', 'password', 'user_type',
            'division', 'district', 'thana', 'address', 'profile_image',
            'license_number', 'experience_years', 'consultation_fee', 'available_timeslots'
        ]

    def validate_mobile(self, value):
        if not re.match(r'^\+88\d{11}$', value):
            raise serializers.ValidationError("Mobile number must start with +88 and be 14 digits.")
        return value

    def validate_password(self, value):
        if (len(value) < 8 or
            not re.search(r'[A-Z]', value) or
            not re.search(r'\d', value) or
            not re.search(r'[!@#$%^&*(),.?":{}|<>]', value)):
            raise serializers.ValidationError(
                "Password must be at least 8 characters, include 1 uppercase, 1 digit, and 1 special character."
            )
        return value

    def validate(self, data):
        user_type = data.get('user_type')
        if user_type == 'admin':
            raise serializers.ValidationError("You cannot register as admin via this endpoint.")
        if user_type == 'doctor':
            required_fields = ['license_number', 'experience_years', 'consultation_fee', 'available_timeslots']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(f"{field} is required for doctors.")
        return data
    def validate_profile_image(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Image size must be 5MB or less.")
            if not value.content_type in ["image/jpeg", "image/png"]:
                raise serializers.ValidationError("Only JPEG and PNG images are allowed.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


from rest_framework import serializers

from .models import Appointment, CustomUser


class DoctorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'available_timeslots']

# backend/accounts/serializers.py
class PrescriptionSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(read_only=True)
    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    doctor_name = serializers.CharField(source="doctor.full_name", read_only=True)
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    appointment_date = serializers.DateField(source="appointment.appointment_date", read_only=True)

    class Meta:
        model = Prescription
        fields = ['id', 'appointment', 'doctor', 'doctor_name', 'patient', 'patient_name', 'appointment_date', 'content', 'created_at']
        
class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.full_name", read_only=True)
    prescription = PrescriptionSerializer(read_only=True)
    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Appointment
        fields = '__all__'

    def validate(self, data):
        # Only run this check if doctor and timeslot are being updated/created
        doctor = data.get('doctor')
        timeslot = data.get('timeslot')
        appointment_date = data.get('appointment_date')

        if doctor and timeslot:
            if timeslot not in (doctor.available_timeslots or ""):
                raise serializers.ValidationError("Selected timeslot is not available for this doctor.")

        # Only check date if appointment_date is present
        if appointment_date:
            from datetime import date
            if appointment_date < date.today():
                raise serializers.ValidationError("Appointment date cannot be in the past.")

        return data


from .models import CustomAppointmentRequest


class CustomAppointmentRequestSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.full_name", read_only=True)
    patient = serializers.PrimaryKeyRelatedField(read_only=True)  # <-- ADD THIS LINE

    class Meta:
        model = CustomAppointmentRequest
        fields = '__all__'


# from rest_framework import generics, permissions

# from .models import Prescription
# from .serializers import PrescriptionSerializer


# class PrescriptionCreateView(generics.CreateAPIView):
#     queryset = Prescription.objects.all()
#     serializer_class = PrescriptionSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         appointment = serializer.validated_data['appointment']
#         serializer.save(doctor=self.request.user, patient=appointment.patient)

# class PrescriptionDetailView(generics.RetrieveAPIView):
#     queryset = Prescription.objects.all()
#     serializer_class = PrescriptionSerializer
#     permission_classes = [permissions.IsAuthenticated]
#     lookup_field = 'appointment'