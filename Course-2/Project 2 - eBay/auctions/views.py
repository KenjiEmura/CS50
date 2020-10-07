from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import *
from .forms import *


def auction(request, product_id, product_name):
    from django.db.models import Avg, Max, Min, Sum, Count
    from django.forms import modelform_factory
    product = Auction.objects.annotate(max_bid=Max('product_bids__bid')).get(pk=product_id)
    count_bid = Bid.objects.filter(product=product_id).count()
    cur_max_bid = product.max_bid
    def step(price): # Function to calculate how big should be the step
        i = 0
        while price/10 > 10:
            price /= 10
            i += 1
        return 10**(i-1)
    if cur_max_bid is None:
        cur_max_bid = product.price
    bid_form = modelform_factory(Bid, form=MakeBid, widgets = {'bid': NumberInput(attrs={'min':cur_max_bid, 'class':'form-field bid','step':step(cur_max_bid)})})

    if cur_max_bid == None:
        no_bids = True;
    else:
        no_bids = False;

    if request.method == "GET":
        return render(request, "auctions/product.html", {
            "product": product,
            "makebid": bid_form,
            "count_bid": count_bid
        })
    elif request.method == "POST":
        form = MakeBid(request.POST)
        if form.is_valid():
            from django.contrib import messages
            posted_bid = form.cleaned_data['bid']
            if not no_bids and posted_bid <= cur_max_bid:
                messages.error(request, f'Your bid has to be greater than ¥{cur_max_bid:,}')
                return HttpResponseRedirect(reverse('auctions:products', args=[ product_id, product_name ]))
            elif product.price >= posted_bid:
                messages.error(request, 'The initial bid has to be greater than the starting selling price')
                return HttpResponseRedirect(reverse('auctions:products', args=[ product_id, product_name ]))
            elif no_bids and product.price < posted_bid:
                messages.success(request, 'Your bid was successfuly received!')
                new_bid = form.save(commit=False)
                new_bid.product = Auction.objects.get(pk=product_id)
                new_bid.save()
                product.price = posted_bid
                product.save()
                return HttpResponseRedirect(reverse('auctions:products', args=[ product_id, product_name ]))
            messages.success(request, 'Your bid was successfuly received!')
            new_bid = form.save(commit=False)
            new_bid.product = Auction.objects.get(pk=product_id)
            new_bid.save()
            product.price = posted_bid
            product.save()
        else:
            messages.error(request, 'An error posting the information occured!')
        return HttpResponseRedirect(reverse('auctions:products', args=[ product_id, product_name ]))


def create(request):
    if request.method == "POST":
        product = CreateProduct(request.POST)
        if product.is_valid():
            new_product = product.save()
            return HttpResponseRedirect(reverse('auctions:products', args=[ new_product.id, new_product.name ]))
    elif request.method == "GET":
        return render(request, "auctions/create-listing.html", {
            "create_product": CreateProduct()
        })


def index(request):
    from django.db.models import Avg, Max, Min, Sum, Count

    return render(request, "auctions/index.html", {
        "auctions": Auction.objects.annotate(
            max_bid=Max('product_bids__bid'),
            bid_count=Count('product_bids'))
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
