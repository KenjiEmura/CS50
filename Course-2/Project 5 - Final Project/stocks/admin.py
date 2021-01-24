from django.contrib import admin
from stocks.models import *

class StockAdmin(admin.ModelAdmin):
    list_display=['name', 'id']

    
class UserStockAdmin(admin.ModelAdmin):
    list_display=['owned_stock', 'id', 'owner', 'for_sale']


admin.site.register(User)
admin.site.register(Stock, StockAdmin)
admin.site.register(Acquisition)
admin.site.register(UserStocks, UserStockAdmin)