from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.forms import ModelForm, Textarea, TextInput, NumberInput
from django import forms
from django.utils.translation import gettext_lazy as _

from .models import User, Auction

class AuctionForm(ModelForm):
    class Meta:
        model = Auction
        fields = ['name', 'img_url', 'price', 'details']
        labels = {
            'name': _('Product Name'),
            'img_url': _('URL of the image'),
            'price': _('Price'),
            'details': _('Description')
        }
        widgets = {
            'name': TextInput(attrs={'class':'form-field title'}),
            'img_url': TextInput(attrs={'class':'form-field image'}),
            'price': NumberInput(attrs={'class':'form-field price'}),
            'details': Textarea(attrs={'class':'form-field details'})
        }



def auction(request, product):
    prod = Auction.objects.get(name=product)
    return render(request, "auctions/product.html", {
        "product": prod
    })


def create(request):
    if request.method == "POST":
        product = CreateProduct(request.POST)
        if product.is_valid():
            pass
    elif request.method == "GET":
        return render(request, "auctions/create-listing.html", {
            "create_product": AuctionForm()
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
