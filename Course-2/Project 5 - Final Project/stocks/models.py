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
        return f"'({self.symbol}) - {self.name} - ID: {self.id}'"




class UserStocks(models.Model):
    owned_stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_stocks')
    qty = models.IntegerField()
    for_sale = models.BooleanField(default=False)
    sell_price = models.DecimalField(max_digits=15, decimal_places=1)

    def __str__(self):
        return f"{self.owner}: {self.owned_stock} - QTY: {self.qty} - ID: {self.id}"




class Acquisition(models.Model):
    transacted_stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buyer_stocks')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seller_stocks')
    qty = models.IntegerField()
    price = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transacted_stock} - Qty: {self.qty} - Transaction ID: {self.id}"