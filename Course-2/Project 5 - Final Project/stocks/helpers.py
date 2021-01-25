
import requests

from stocks.keys import * # This is the file with all the keys and secret information
from stocks.models import *


def update_user_total_stocks(user_id):
    
    # Get all the transactions made by the user
    all_transactions = Acquisition.objects.filter(buyer=user_id).values('transacted_stock', 'qty')

    # Create a dict where we are going to group and sum up all the stocks owned by the user
    subtotals = {}
    for transaction in all_transactions:
        # If the stock is already in the dict
        if subtotals.get(transaction['transacted_stock']):
            subtotals[transaction['transacted_stock']] += transaction['qty']
        # If not, then add it
        else:
            subtotals[transaction['transacted_stock']] = transaction['qty']

    # Check if the stock is in the user's table and update the values, otherwise, create the new entry
    for stock_id, stock_qty in subtotals.items():
        
        stock = UserStocks.objects.filter(owner=user_id).filter(owned_stock=stock_id).exists()

        if stock:
            stock = UserStocks.objects.filter(owner=user_id).get(owned_stock=stock_id)
            stock.qty = stock_qty
            stock.save()
        else:
            assigned_stock = Stock.objects.get(pk=stock_id)
            stock = UserStocks(
                owned_stock=assigned_stock,
                owner=user_id,
                qty=stock_qty,
                for_sale=False,
                sell_price=0,
            )
            stock.save()
    
    return subtotals



def fetch_pirces_from_API(raw_subtotals, user_id):

    stocks_symbols = [] # Symbols of the stocks that we need to fetch the IEX API information from
    stocks_information = {} # This is the dict that will contain all the cleaned data that will be send to render

    # Fill the stocks with the id of the stock and the quantity, but we need more information and also clean the data
    for stock_id, stock_qty in raw_subtotals.items():
        stock = Stock.objects.filter(pk=stock_id).exists()
        user_owned_stock = UserStocks.objects.filter(owner=user_id).filter(owned_stock=stock_id).exists()
        if user_owned_stock:
            user_owned_stock = UserStocks.objects.filter(owner=user_id).get(owned_stock=stock_id)
            sell_price = user_owned_stock.sell_price
            for_sale = user_owned_stock.for_sale
        else:
            sell_price = 0
            for_sale = False
        # print(f'The stock_id is: {stock_id}, the boolean "stock" variable is: {stock} and the "user_owned_stock" is: {user_owned_stock}')
        if stock:
            stock = Stock.objects.get(pk=stock_id)
            stocks_information[stock_id] = {'qty': stock_qty, 'name': stock.name, 'symbol': stock.symbol, 'user_sell_price': sell_price, 'for_sale': for_sale}
            stocks_symbols.append(stock.symbol)

    # Prepare the string that is going to be used in the API Call, which will indicate which Stocks are we going to get information from
    stocks_api = ",".join(stocks_symbols)

    # Make the API Call, notice that the API key is held in the 'keys.py' file
    api_call = requests.get('https://sandbox.iexapis.com/stable/stock/market/batch?symbols='+stocks_api+'&types=quote&token='+IEX_API_TOKEN)

    # Store the received data as a dict
    data = api_call.json()

    # Add the fetched price as a new piece of information in our stocks_information dict
    for stock_id, stock_info in stocks_information.items():
        user_owned_stock = UserStocks.objects.filter(owner=user_id).filter(owned_stock=stock_id).exists()
        if user_owned_stock:
            user_owned_stock = UserStocks.objects.filter(owner=user_id).get(owned_stock=stock_id)
            stock_info['market_price'] = data[stock_info['symbol']]['quote']['latestPrice']
            if stock_info['user_sell_price'] < data[stock_info['symbol']]['quote']['latestPrice']:
                stock_info['user_sell_price'] = data[stock_info['symbol']]['quote']['latestPrice']

    return stocks_information