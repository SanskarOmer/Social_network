from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSignupSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserProfileSerializer


#  SIGNUP VIEW 
class SignupView(APIView):
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# LOGIN VIEW 
class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# PROFILE VIEW (GET & PATCH)
class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update the currently authenticated user's profile.
    Added MultiPartParser and FormParser so file uploads (profile picture)
    are accepted when the client sends multipart/form-data.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = UserProfileSerializer

    def get_object(self):
        # Return the currently logged-in user
        return self.request.user
