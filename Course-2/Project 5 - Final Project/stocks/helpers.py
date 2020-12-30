
from stocks.models import *


def update_user_total_stocks(user_id):


    # Get all the transactions made by the user
    all_transactions = Acquisition.objects.filter(owner=user_id).values('transacted_stock', 'qty')


    # Create a dict where we are going to group and sum up all the stocks owned by the user
    subtotals = {}
    for transaction in all_transactions:
        # If the stock is already in the dict
        if subtotals.get(transaction['transacted_stock']):
            subtotals[transaction['transacted_stock']] += transaction['qty']
        # If not, then add it
        else:
            subtotals[transaction['transacted_stock']] = transaction['qty']


    # Check if the stock has been already registered for the user and update the values, otherwise, create the new entry
    for stock_id, stock_qty in subtotals.items():
        stock = UserStocks.objects.filter(owner=user_id).get(owned_stock=stock_id); 
        if stock:
            stock.qty = stock_qty
            stock.save()
        else:
            stock = UserStocks(
                owned_stock=stock_id,
                owner=user_id,
                qty=stock_qty,
                sell_price=0,
            )
    
    return subtotals
