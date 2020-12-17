from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.core.paginator import Paginator
from django.shortcuts import render
from django.urls import reverse
from django.db.models import Count
from django.http import JsonResponse
import json



def index(request):
    return render(request, "stocks/index.html", {
        'title': 'Index',
    })


def login_view(request):
    pass