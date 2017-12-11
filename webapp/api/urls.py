from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

import api.views


urlpatterns = [
    url(r'^auth', obtain_jwt_token),
    url(r'^refresh', refresh_jwt_token),
    url(r'^verify', verify_jwt_token),

    # url(r'^series/detail', api.views.series_detail, name="api_series_detail"),
    # url(r'^series/find', api.views.series_find, name="api_series_find"),
    url(r'^age/list', api.views.age_list, name="api_age_list"),
    url(r'^all/list', api.views.all_list, name="api_all_list"),
    url(r'^experimentalbatch/list', api.views.experimentalbatch_list, name="api_experimentalbatch_list"),
    url(r'^pfu/list', api.views.pfu_list, name="api_pfu_list"),
    url(r'^tissue/list', api.views.tissue_list, name="api_tissue_list"),
    url(r'^timeseries', api.views.time_series, name="api_time_series"),
    # url(r'^heatmap', api.views.heatmap, name="api_heatmap")
]
