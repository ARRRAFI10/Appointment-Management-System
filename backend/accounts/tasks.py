# backend/accounts/tasks.py
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Appointment
from django.core.mail import send_mail

@shared_task
def send_appointment_reminders():
    now = timezone.now()
    reminder_time = now + timedelta(hours=24)
    appointments = Appointment.objects.filter(
        appointment_date=reminder_time.date(),
        timeslot__gte=reminder_time.time(),
        notified=False  # Add this field to your model!
    )
    for appt in appointments:
        send_mail(
            'Appointment Reminder',
            f'Dear {appt.patient.full_name}, you have an appointment with Dr. {appt.doctor.full_name} on {appt.appointment_date} at {appt.timeslot}.',
            settings.EMAIL_HOST_USER,
            [appt.patient.email],
            fail_silently=False,
        )
        appt.notified = True
        appt.save()