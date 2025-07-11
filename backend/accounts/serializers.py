import re

from rest_framework import serializers

from .models import CustomUser


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

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user