from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models

USER_TYPE_CHOICES = (
    ('admin', 'Admin'),
    ('doctor', 'Doctor'),
    ('patient', 'Patient'),
)

DIVISION_CHOICES = (
    ('Dhaka', 'Dhaka'),
    ('Chittagong', 'Chittagong'),
    # Add all divisions as needed
)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, mobile, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        if not mobile:
            raise ValueError('Mobile number is required')
        email = self.normalize_email(email)
        user = self.model(email=email, mobile=mobile, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, mobile, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, mobile, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=14, unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    division = models.CharField(max_length=50, choices=DIVISION_CHOICES)
    district = models.CharField(max_length=50)
    thana = models.CharField(max_length=50)
    address = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Doctor-specific fields
    license_number = models.CharField(max_length=50, blank=True, null=True)
    experience_years = models.PositiveIntegerField(blank=True, null=True)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    available_timeslots = models.CharField(max_length=255, blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['mobile', 'full_name', 'user_type', 'division', 'district', 'thana']

    def __str__(self):
        return self.email


from django.conf import settings
from django.db import models


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='patient_appointments', on_delete=models.CASCADE)
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='doctor_appointments', on_delete=models.CASCADE)
    appointment_date = models.DateField()
    timeslot = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    notified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.patient} with {self.doctor} on {self.appointment_date} at {self.timeslot}"


# backend/accounts/models.py
class Prescription(models.Model):
    appointment = models.OneToOneField('Appointment', on_delete=models.CASCADE, related_name='prescription')
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='doctor_prescriptions')
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_prescriptions')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription for {self.patient.full_name} by {self.doctor.full_name} on {self.appointment.appointment_date}"

