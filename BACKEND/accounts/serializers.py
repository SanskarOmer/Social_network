from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser


# === Signup serializer ===
class UserSignupSerializer(serializers.ModelSerializer):
    """Create a new user. Password is write-only and hashed before saving."""

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'full_name', 'date_of_birth', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Hash the password then create the user using the model's manager
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # simplejwt expects a username field — we use email as the credential
    username_field = 'email'

    def validate(self, attrs):
        # Map 'email' to 'username' so TokenObtainPairSerializer authenticates properly
        attrs['username'] = attrs.get('email')
        data = super().validate(attrs)
        # Include some basic user info in the response to make front-end usage simpler
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'full_name': self.user.full_name,
        }
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer used for viewing/updating the current user's profile."""

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'full_name', 'date_of_birth', 'profile_picture']
        read_only_fields = ['email']  # users can’t change email

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance