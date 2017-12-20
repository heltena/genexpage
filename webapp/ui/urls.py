from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^debug$', views.debug, name='debug'),
    url(r'^first$', views.first, name='first'),
    url(r'^$', views.index, name='index')
]
