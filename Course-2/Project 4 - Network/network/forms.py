from django.utils.translation import gettext_lazy as _
from django.forms import ModelForm, Textarea, TextInput, NumberInput, Select, HiddenInput
from .models import *

class NewPost(ModelForm):
    class Meta:
        model = Post
        fields = ['post']
        labels = {
            'post': _('New Post'),
        }
        widgets = {
            'post': Textarea(attrs={'class':'form-field post', 'autofocus':True, 'placeholder':'Shout your thoughts to the world...'})
        }