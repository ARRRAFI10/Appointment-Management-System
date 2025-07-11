from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

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