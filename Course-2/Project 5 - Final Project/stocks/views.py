from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.utils.safestring import mark_safe
from django.core.paginator import Paginator
from django.shortcuts import render
from django.urls import reverse
from django.db.models import Count, Sum
from django.http import JsonResponse
import json
import requests

from stocks.keys import * # This is the file with all the keys and secret information
from stocks.helpers import * # This is the file with helper functions
from stocks.models import *




def index(request):
    if request.user.is_authenticated:
        raw_subtotals = update_user_total_stocks(request.user)
        stocks_information = fetch_pirces_from_API(raw_subtotals, request.user)

        return render(request, "stocks/dashboard.html", {
            'title': 'Index',
            'stocks_information': stocks_information,
        })
    else:
        return HttpResponseRedirect(reverse("stocks:login"))





def set_sell_stock_price(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    stock = UserStocks.objects.filter(owner=request.user).get(owned_stock=data['stock_id'])

    stock.sell_price = data['sell_price']
    stock.save()

    return JsonResponse({"message": f"This is the data: {data}"}, status=201)    

    
    
    
def update_for_sale(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    stock = UserStocks.objects.filter(owner=request.user).get(owned_stock=data['stock_id'])

    stock.for_sale = data['for_sale']
    stock.save()

    return JsonResponse({"message": f"This is the data: {data}"}, status=201)    





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
                return HttpResponseRedirect(reverse("stocks:dashboard"))
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
    return HttpResponseRedirect(reverse("stocks:dashboard"))




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
        return HttpResponseRedirect(reverse("stocks:dashboard"))
    else:
        return render(request, "stocks/register.html")





def buy_stock(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    for data_field_key, data_field_value in data.items():
        if data_field_value == '':
            messages.error(request, f"Error: The '{data_field_key}' field is empty!")
            return JsonResponse({"error": f"Error: The {data_field_key} is empty!"}, status=400)


    if data['transaction_type'] == 'buy':

        stock = Stock.objects.filter(symbol=data['symbol'])
        symbol = data['symbol'].upper()
        name = data['name']
        price = float(data['price'])
        qty = int(data['qty'])

        if request.user.cash > price * qty:
            message = 'good to go!'
            if not stock.exists():
                new_stock = Stock(name=name, symbol=symbol)
                new_stock.save()
                stock = new_stock
            else:
                stock = Stock.objects.get(symbol=symbol)
            seller = User.objects.get(pk=1)
            new_transaction = Acquisition(
                transacted_stock = stock,
                buyer = request.user,
                seller = seller, # The seller is going to be the Admin
                qty = qty,
                price = price
            )
            new_transaction.save()
            messages.success(request,mark_safe(f'The transaction was successful! (Stock Name: {name}, Qty: {qty})<br/>Total transaction cost: <strong>${qty * price}</strong>'))
            request.user.cash -= price * qty
            request.user.save()
            return JsonResponse({"message": "Succesful transaction!"}, status=201)    
        else :
            messages.error(request, f"Error: You don't have enough cash!")
            return JsonResponse({"error": "You don't have enough cash!"}, status=400)
        

    elif data['transaction_type'] == 'sell':

        transacted_stock = Stock.objects.get(pk=data['stock_id'])
        price = float(data['price'])
        qty = int(data['qty'])

        new_transaction = Acquisition(
            transacted_stock = transacted_stock,
            buyer = User.objects.get(pk=1),
            seller = request.user, # The seller is going to be the Admin
            qty = -1 * qty,
            price = price
        )
        new_transaction.save()

        request.user.cash += qty * price
        request.user.save()

        messages.success(request,mark_safe(f'The transaction was successful! (Stock Name: {transacted_stock.name}, Qty: {qty}, Price: {price})<br/>Total cash earned: <strong>${qty * price}</strong>'))

        return JsonResponse({"message": "The 'sell' button is working"}, status=201)
    

    else:
        return JsonResponse({"error": "Invalid transaction type"}, status=400)




def test(request):
    return render(request, "stocks/test.html")