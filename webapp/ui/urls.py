from django.conf.urls import url
from . import views

urlpatterns = [
    # url(r'^debug$', views.debug, name='debug'),
    # url(r'^first$', views.first, name='first'),
    # url(r'^simple$', views.simple, name='simple'),
    # url(r'^german$', views.german, name='german'),
    # url(r'^felix$', views.fenix, name='fenix'),
    url(r'^$', views.release, name='release')
]
