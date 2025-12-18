from django.urls import path
from .views import posts_list_create, post_delete, like_toggle

urlpatterns = [
    path('posts/', posts_list_create, name='post-list-create'),
    path('posts/<int:pk>/', post_delete, name='post-delete'),
    path('posts/<int:pk>/like/', like_toggle, name='post-like-toggle'),
]
