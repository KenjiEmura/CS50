from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime


class User(AbstractUser):
    cash = models.IntegerField(default=10000)

    def __str__(self):
        return f"{self.username}"




class Stock(models.Model):
    name = models.CharField(max_length=64)
    symbol = models.CharField(max_length=5)

    def __str__(self):
        return f"{self.name}"




class UserStocks(models.Model):
    owned_stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_stocks')
    qty = models.IntegerField()
    sell_price = models.IntegerField()

    def __str__(self):
        return f"{self.owner}: {self.owned_stock} - {self.qty}"




class Acquisition(models.Model):
    transacted_stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    qty = models.IntegerField()
    price = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transacted_stock} - Qty: {self.qty}"