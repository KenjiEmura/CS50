from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms

from .models import User, Auction


class CreateProduct(forms.Form):
    name = forms.CharField(
        label = "Product Name",
        widget = forms.TextInput(attrs={'class':'form title'}),
        max_length = Auction._meta.get_field('name').max_length
    )
    img_url = forms.CharField(
        label = "URL of the image",
        widget = forms.TextInput(attrs={'class':'form image'}),
        max_length = Auction._meta.get_field('img_url').max_length
    )
    price = forms.IntegerField(
        widget = forms.NumberInput(attrs={'class':'form price'})
    )
    details = forms.CharField(
        label = "Description",
        widget = forms.Textarea(attrs={'class':'form title'}),
        max_length = Auction._meta.get_field('details').max_length
    )


def auction(request, product):
    prod = Auction.objects.get(name=product)
    return render(request, "auctions/product.html", {
        "product": prod
    })


def create(request):
    if request.method == POST:
        product = CreateProduct(request.POST)
        if product.is_valid():
            pass
    return render(request, "auctions/create-listing.html", {

    })


def index(request):
    return render(request, "auctions/index.html", {
        "auctions": Auction.objects.all()
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("auctions:index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("auctions:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
