from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime


class User(AbstractUser):
    pass

class Auction(models.Model):
    name = models.CharField(max_length=64)
    img_url = models.CharField(max_length=300)
    price = models.IntegerField()
    details = models.TextField(max_length=600)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.name}"

class Bid(models.Model):
    user = models.ManyToManyField(User, blank=False, related_name="user_bids")
    bid = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"${self.bid} by {self.user} ({self.timestamp})"

class Comment(models.Model):
    user = models.ManyToManyField(User, blank=False, related_name="user_comments")
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name="product_comments")
    comment = models.TextField(max_length=600)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user} comment on {self.auction} ({self.timestamp})"