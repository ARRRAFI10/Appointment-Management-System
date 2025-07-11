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