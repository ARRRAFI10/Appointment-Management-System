from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from accounts.models import Appointment
from django.core.mail import send_mail
from django.conf import settings

class Command(BaseCommand):
    help = 'Send appointment reminders 24 hours before appointment'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        reminder_time = now + timedelta(hours=24)
        appointments = Appointment.objects.filter(
            appointment_date=reminder_time.date(),
            notified=False
        )
        for appt in appointments:
            send_mail(
                'Appointment Reminder',
                f'Dear {appt.patient.full_name}, you have an appointment with Dr. {appt.doctor.full_name} on {appt.appointment_date} at {appt.timeslot}.',
                settings.DEFAULT_FROM_EMAIL,
                [appt.patient.email],
                fail_silently=False,
            )
            appt.notified = True
            appt.save()
        self.stdout.write(self.style.SUCCESS('Reminders sent!'))