from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser



# Signup serializer
class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'full_name', 'date_of_birth', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# Login serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # use email for authentication

    def validate(self, attrs):
        # simplejwt expects a 'username', but our model uses 'email'
        attrs['username'] = attrs.get('email')
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'full_name': self.user.full_name,
        }
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'full_name', 'date_of_birth', 'profile_picture']
        read_only_fields = ['email']  # users can’t change email

    def update(self, instance, validated_data):
        # Update only the provided fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance