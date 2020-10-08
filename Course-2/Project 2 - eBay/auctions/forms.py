from django.utils.translation import gettext_lazy as _
from django.forms import ModelForm, Textarea, TextInput, NumberInput, Select
from .models import *

class CreateProduct(ModelForm):
    class Meta:
        model = Auction
        fields = ['name', 'category', 'img_url', 'price', 'details']
        labels = {
            'name': _('Product Name'),
            'category':_('Category'),
            'img_url': _('URL of the image'),
            'price': _('Price'),
            'details': _('Description')
        }
        widgets = {
            'name': TextInput(attrs={'class':'form-field title'}),
            'category': Select(attrs={'class':'form-field category'}),
            'img_url': TextInput(attrs={'class':'form-field image'}),
            'price': NumberInput(attrs={'class':'form-field price'}),
            'details': Textarea(attrs={'class':'form-field details'})
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