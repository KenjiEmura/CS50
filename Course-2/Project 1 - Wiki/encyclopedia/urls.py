from django.urls import path

from . import views

app_name = "encyclopedia"
urlpatterns = [
    path("", views.index, name="index"),
    path("<str:entry_title>", views.entry, name="entry"),
    path("search/", views.query, name="query"),
    path("new-entry/", views.new_entry, name="new-entry"),
    path("edit/", views.edit, name="edit")
]
