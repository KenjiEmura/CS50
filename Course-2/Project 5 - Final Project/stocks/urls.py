from django.urls import path
from . import views

app_name = "stocks"
urlpatterns = [

    # Regular URLs
    path("", views.index, name="dashboard"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("test", views.test, name="test"),
    path("user_market", views.user_market, name="user_market"),

    
    # API Routes
    path("API/set_sell_stock_price", views.set_sell_stock_price, name="set_stock_price"),
    path("API/update_for_sale", views.update_for_sale, name="update_for_sale"),
	  path("API/trade-stock", views.trade_stock, name="trade_stock" )

]