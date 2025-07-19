from datetime import timedelta

from accounts.models import Appointment, CustomAppointmentRequest, CustomUser
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    help = 'Seed the database with sample Bangladeshi users, doctors, and appointments.'

    def handle(self, *args, **kwargs):
        # Sample doctors
        doctors_data = [
            {
                'full_name': 'Dr. Ayesha Siddiqua',
                'email': 'ayesha.siddiqua@hospital.com',
                'mobile': '+8801711000001',
                'user_type': 'doctor',
                'division': 'Dhaka',
                'district': 'Dhaka',
                'thana': 'Dhanmondi',
                'address': 'House 12, Road 5, Dhanmondi',
                'license_number': 'DOC12345',
                'experience_years': 10,
                'consultation_fee': 800.00,
                'available_timeslots': '10:00-10:30,11:00-11:30,15:00-15:30',
            },
            {
                'full_name': 'Dr. Mahmudul Hasan',
                'email': 'mahmudul.hasan@hospital.com',
                'mobile': '+8801711000002',
                'user_type': 'doctor',
                'division': 'Chattogram',
                'district': 'Chattogram',
                'thana': 'Panchlaish',
                'address': 'House 22, Road 3, Panchlaish',
                'license_number': 'DOC67890',
                'experience_years': 7,
                'consultation_fee': 600.00,
                'available_timeslots': '09:00-09:30,13:00-13:30,16:00-16:30',
            },
        ]

        # Sample patients
        patients_data = [
            {
                'full_name': 'Rahim Uddin',
                'email': 'rahim.uddin@gmail.com',
                'mobile': '+8801811000001',
                'user_type': 'patient',
                'division': 'Dhaka',
                'district': 'Dhaka',
                'thana': 'Mirpur',
                'address': 'Flat 3B, House 7, Mirpur 10',
            },
            {
                'full_name': 'Fatema Begum',
                'email': 'fatema.begum@gmail.com',
                'mobile': '+8801811000002',
                'user_type': 'patient',
                'division': 'Sylhet',
                'district': 'Sylhet',
                'thana': 'Zindabazar',
                'address': 'House 5, Zindabazar',
            },
        ]

        # Create doctors
        for doc in doctors_data:
            user, created = CustomUser.objects.get_or_create(
                email=doc['email'],
                defaults={
                    'full_name': doc['full_name'],
                    'mobile': doc['mobile'],
                    'user_type': 'doctor',
                    'division': doc['division'],
                    'district': doc['district'],
                    'thana': doc['thana'],
                    'address': doc['address'],
                    'license_number': doc['license_number'],
                    'experience_years': doc['experience_years'],
                    'consultation_fee': doc['consultation_fee'],
                    'available_timeslots': doc['available_timeslots'],
                }
            )
            if created:
                user.set_password('Password1!')
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created doctor: {user.full_name}"))
            else:
                self.stdout.write(f"Doctor already exists: {user.full_name}")

        # Create patients
        for pat in patients_data:
            user, created = CustomUser.objects.get_or_create(
                email=pat['email'],
                defaults={
                    'full_name': pat['full_name'],
                    'mobile': pat['mobile'],
                    'user_type': 'patient',
                    'division': pat['division'],
                    'district': pat['district'],
                    'thana': pat['thana'],
                    'address': pat['address'],
                }
            )
            if created:
                user.set_password('Password1!')
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created patient: {user.full_name}"))
            else:
                self.stdout.write(f"Patient already exists: {user.full_name}")

        # Create sample appointments
        doctor1 = CustomUser.objects.get(email='ayesha.siddiqua@hospital.com')
        doctor2 = CustomUser.objects.get(email='mahmudul.hasan@hospital.com')
        patient1 = CustomUser.objects.get(email='rahim.uddin@gmail.com')
        patient2 = CustomUser.objects.get(email='fatema.begum@gmail.com')

        today = timezone.now().date()
        appt_data = [
            {
                'patient': patient1,
                'doctor': doctor1,
                'appointment_date': today + timedelta(days=1),
                'timeslot': '10:00-10:30',
                'notes': 'Follow-up visit',
                'status': 'confirmed',
            },
            {
                'patient': patient2,
                'doctor': doctor2,
                'appointment_date': today + timedelta(days=2),
                'timeslot': '13:00-13:30',
                'notes': 'First consultation',
                'status': 'pending',
            },
        ]
        for appt in appt_data:
            obj, created = Appointment.objects.get_or_create(
                patient=appt['patient'],
                doctor=appt['doctor'],
                appointment_date=appt['appointment_date'],
                timeslot=appt['timeslot'],
                defaults={
                    'notes': appt['notes'],
                    'status': appt['status'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created appointment: {obj}"))
            else:
                self.stdout.write(f"Appointment already exists: {obj}")

        # Create a sample custom appointment request
        CustomAppointmentRequest.objects.get_or_create(
            patient=patient1,
            doctor=doctor2,
            desired_date=today + timedelta(days=3),
            desired_timeslot='16:00-16:30',
            defaults={
                'reason': 'Need urgent consultation',
                'status': 'pending',
            }
        )
        self.stdout.write(self.style.SUCCESS("Sample data seeding complete.")) 