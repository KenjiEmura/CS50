from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime


class User(AbstractUser):
    follow = models.ManyToManyField('self', blank=True, related_name='followers')

    def __str__(self):
        return f"{self.username}"

class Post(models.Model):
    post = models.CharField(max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, default=0, blank=True, related_name="people_that_clicked_liked")

    def __str__(self):
        return f"{self.post} | {self.author}"