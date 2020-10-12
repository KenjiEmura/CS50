from django.urls import path

from . import views

app_name = "auctions"
urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create-listing", views.create, name="create-listing"),
    path("<int:product_id>/<str:product_name>", views.auction, name="products"),
    path("add-to-watchlist/<int:product_id>/<str:product_name>", views.add_to_watchlist, name="add_to_watchlist"),
    path("remove_from_watchlist/<int:product_id>/<str:product_name>", views.remove_from_watchlist, name="remove_from_watchlist"),
    path("close_auction/<int:product_id>/<str:product_name>", views.close_auction, name="close_auction"),
    path("open_auction/<int:product_id>/<str:product_name>", views.open_auction, name="open_auction")
]