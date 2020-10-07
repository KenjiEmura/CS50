from django.utils.translation import gettext_lazy as _
from django.forms import ModelForm, Textarea, TextInput, NumberInput, Select
from .models import *

class CreateProduct(ModelForm):
    class Meta:
        model = Auction
        fields = ['name', 'img_url', 'price', 'details', 'category']
        labels = {
            'name': _('Product Name'),
            'img_url': _('URL of the image'),
            'price': _('Price'),
            'details': _('Description'),
            'category':_('Category')
        }
        widgets = {
            'name': TextInput(attrs={'class':'form-field title'}),
            'img_url': TextInput(attrs={'class':'form-field image'}),
            'price': NumberInput(attrs={'class':'form-field price'}),
            'details': Textarea(attrs={'class':'form-field details'}),
            'category': Select(attrs={'class':'form-field category'})
        }

class MakeBid(ModelForm):
    class Meta:
        model = Bid
        fields = ['bid']
        labels = {
            'bid': _('Make a bid:')
        }
        widgets = {
            'bid': NumberInput(attrs={'class':'form-field bid'})
        }