from django.urls import path
from . import views

app_name = "stocks"
urlpatterns = [

    # Regular URLs
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    
    # API Routes

]