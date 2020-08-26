from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:name>", views.greet, name="greet"),
    path("kenji", views.kenji, name="kenji"),
    path("david", views.david, name="david")
]