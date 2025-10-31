from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user_email', 'image', 'description', 'created_at', 'likes_count']

    def get_likes_count(self, obj):
        return obj.likes.count()
