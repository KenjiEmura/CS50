from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime


class User(AbstractUser):
    
    def __str__(self):
        return f"{self.username}"


class Stock(models.Model):
    name = models.CharField(max_length=64)
    price = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name}"