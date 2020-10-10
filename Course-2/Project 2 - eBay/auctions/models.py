from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime


class User(AbstractUser):
    def __str__(self):
        return f"{self.username}"

class ProductCategory(models.Model):
    name = models.CharField(max_length=64)
    parent_category = models.ForeignKey('self', blank=True, null=True, default=1, on_delete=models.CASCADE, related_name="children_categories")
    def __str__(self):
        return f"{self.name}"

class Auction(models.Model):
    name = models.CharField(max_length=64)
    watchlist = models.ManyToManyField(User, default=None, blank=True, related_name="users")
    img_url = models.CharField(max_length=300)
    category = models.ForeignKey(ProductCategory, default=1, on_delete=models.CASCADE, related_name="products")
    price = models.IntegerField()
    details = models.TextField(max_length=600)
    author = models.ForeignKey(User, default=1, on_delete=models.CASCADE, related_name="user_products")
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.name}"

class Bid(models.Model):
    user = models.ForeignKey(User, blank=False, default=1, on_delete=models.CASCADE, related_name="user_bids")
    bid = models.IntegerField()
    product = models.ForeignKey(Auction, blank=False, null=True, default=None, on_delete=models.CASCADE, related_name="product_bids")
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.product} ${self.bid} by {self.user}"

class Comment(models.Model):
    user = models.ManyToManyField(User, blank=False, related_name="user_comments")
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name="product_comments")
    comment = models.TextField(max_length=600)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user} comment on {self.auction} ({self.timestamp})"