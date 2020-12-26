from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.core.paginator import Paginator
from django.shortcuts import render
from django.urls import reverse
from django.db.models import Count, Sum
from django.http import JsonResponse
import json

from stocks.models import *

def index(request):
    acquisitions = Acquisition.objects.filter(owner_id=1).values('name', 'qty')
    total_transactions = {}
    for transaction in acquisitions:
        if total_transactions.get(transaction['name']):
            total_transactions[transaction['name']] += transaction['qty']
        else:
            total_transactions[transaction['name']] = transaction['qty']
            
    return render(request, "stocks/index.html", {
        'title': 'Index',
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
            if 'next' in request.POST:
                return HttpResponseRedirect(request.POST.get('next'))
            else:
                return HttpResponseRedirect(reverse("stocks:index"))
        else:
            if 'next' in request.POST:
                return render(request, "stocks/login.html", {
                    "message": "Invalid username and/or password.",
                    "next": request.POST.get('next')
                })
            else:
                return render(request, "stocks/login.html", {
                    "message": "Invalid username and/or password."
                })
    else:
        return render(request, "stocks/login.html")



def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("stocks:index"))



def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "stocks/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "stocks/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("stocks:index"))
    else:
        return render(request, "stocks/register.html")

@login_required(login_url='stocks:login')
def users(request):
    users = User.objects.all()

    return render(request, "stocks/users.html", {
        'users': users,
    })