from django.conf.urls import url
from . import views
from genexpage.settings import DEBUG

urlpatterns = [
    # url(r'^debug$', views.debug, name='debug'),
    # url(r'^first$', views.first, name='first'),
    # url(r'^simple$', views.simple, name='simple'),
    # url(r'^german$', views.german, name='german'),
    url(r'^$', views.release, name='release')
]

if DEBUG:
    print("DEBUG!")
    urlpatterns.append(url(r'^debug$', views.debug, name='debug'))