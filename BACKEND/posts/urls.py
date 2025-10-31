from django.urls import path
from .views import PostListCreateView, PostDeleteView, LikeToggleView

urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDeleteView.as_view(), name='post-delete'),
    path('posts/<int:pk>/like/', LikeToggleView.as_view(), name='post-like-toggle'),
]
