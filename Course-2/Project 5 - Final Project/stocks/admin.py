from django.contrib import admin
from stocks.models import *

admin.site.register(User)
admin.site.register(Stock)
admin.site.register(Acquisition)
admin.site.register(UserStocks)