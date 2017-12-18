from django.shortcuts import render
from django.http import HttpResponseRedirect

from django import forms
from django.forms import formset_factory


def index(request):
    return render(request, 'index.html')

def debug(request):
    return render(request, 'debug.html')