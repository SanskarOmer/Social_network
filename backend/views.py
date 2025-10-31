from django.http import HttpResponse

def home(request):
    return HttpResponse("<h2>Welcome to Social Network Backend API</h2><p>Use /api/signup/ to register.</p>")
