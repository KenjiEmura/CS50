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
import requests

from stocks.keys import * # This is the file with all the keys and secret information

from stocks.helpers import * # This is the file with helper functions

from stocks.models import *




def index(request):

    # Get all the transactions made by the user
    all_transactions = Acquisition.objects.filter(owner_id=1).values('transacted_stock', 'qty')

    # Create a dict where we are going to group and sum up all the stocks owned by the user
    raw_subtotals = update_user_total_stocks(request.user)

    for transaction in all_transactions:
        # If the stock is already in the dict
        if raw_subtotals.get(transaction['transacted_stock']):
            raw_subtotals[transaction['transacted_stock']] += transaction['qty']
        # If not, then add it
        else:
            raw_subtotals[transaction['transacted_stock']] = transaction['qty']

    stocks_symbols = [] # From which stocks do we need to fetch the information from the IEX API?
    stocks_information = {} # This is the dict that will contain all the cleaned data that will be send to render

    # Fill the raw_subtotals with the id of the stock and the quantity, but we need more information and also clean the data
    for stock_id, stock_qty in raw_subtotals.items():
        stock = Stock.objects.get(pk=stock_id)
        stocks_information[stock_id] = {'qty': stock_qty, 'name': stock.name, 'symbol': stock.symbol}
        stocks_symbols.append(stock.symbol)

    # Prepare the string that is going to be used in the API Call, which will indicate which Stocks are we going to get information from
    stocks_api = ",".join(stocks_symbols)

    # Make the API Call, notice that the API key is held in the 'keys.py' file
    api_call = requests.get('https://sandbox.iexapis.com/stable/stock/market/batch?symbols='+stocks_api+'&types=quote&token='+IEX_API_TOKEN)

    # Store the received data as a dict
    data = api_call.json()

    # Add the fetched price as a new piece of information in our stocks_information dict
    for stock_id, stock_info in stocks_information.items():
        stock_info['price'] = data[stock_info['symbol']]['quote']['latestPrice']

    return render(request, "stocks/index.html", {
        'title': 'Index',
        'stocks_information': stocks_information,
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