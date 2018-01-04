from django.shortcuts import render
from django.http import HttpResponseRedirect

from django import forms
from django.forms import formset_factory


def debug(request):
    return render(request, 'debug.html')

def first(request):
    return render(request, 'first.html')

def simple(request):
    return render(request, 'simple.html')

def index(request):
    return render(request, 'index.html')