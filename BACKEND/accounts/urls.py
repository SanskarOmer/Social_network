from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import signup_view, CustomLoginView, profile_view

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', profile_view, name='profile'), 
]
