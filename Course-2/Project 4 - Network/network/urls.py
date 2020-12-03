
from django.urls import path
from . import views

app_name = "network"
urlpatterns = [
    # Regular URLs
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:profile_name>", views.profile, name="profile"),
    path("following", views.following, name="following"),

    # POST routes
    path("new-post", views.new_post, name="new_post"),

    # PUT routes
    path("like", views.like, name="like"),
    path("follow", views.follow, name="follow"),
    path("edit_post/<int:post_id>", views.edit_post, name="edit_post"),

]
