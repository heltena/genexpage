from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt

from api.tags import method
from collections import defaultdict
import json
import numpy as np
from api.data_alg import generate_data
from api.models import Age, Pfu, ExperimentalBatch, Tissue


class NumpyEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NumpyEncoder, self).default(obj)


@csrf_exempt
@method(allowed=['GET'])
def age_list(request):
    ages = Age.objects.all().order_by("name")
    result = [t.name for t in ages]
    return JsonResponse(result, safe=False)

@csrf_exempt
@method(allowed=['GET'])
def all_list(request):
    ages = Age.objects.all().order_by("name")
    pfus = Pfu.objects.all().order_by("name")
    experimentalbatches = ExperimentalBatch.objects.all().order_by("name")
    tissues = Tissue.objects.all().order_by("name")
    result = {
        "age": [t.name for t in ages],
        "pfu": [t.name for t in pfus],
        "experimental_batch": [t.name for t in experimentalbatches],
        "tissue": [t.name for t in tissues]
    }
    return JsonResponse(result)


@csrf_exempt
@method(allowed=['GET'])
def pfu_list(request):
    pfus = Pfu.objects.all().order_by("name")
    result = [t.name for t in pfus]
    return JsonResponse(result, safe=False)


@csrf_exempt
@method(allowed=['GET'])
def experimentalbatch_list(request):
    experimentalbatches = ExperimentalBatch.objects.all().order_by("name")
    result = [t.name for t in experimentalbatches]
    return JsonResponse(result, safe=False)


@csrf_exempt
@method(allowed=['GET'])
def tissue_list(request):
    tissues = Tissue.objects.all().order_by("name")
    result = [t.name for t in tissues]
    return JsonResponse(result, safe=False)


@csrf_exempt
@method(allowed=['POST'])
def time_series(request):
    body = json.loads(request.body.decode("utf-8"))
    xaxis = body.get("xaxis", None)
    series = body.get("series", None)
    restrictions = body.get("restrictions", [])
    
    if xaxis is None:
        result = {"ok": False,
                  "message": "xaxis not valid"}
        return JsonResponse(result)

    if series is None:
        result = {"ok": False,
                  "message": "series not valid"}
        return JsonResponse(result)

    result = generate_data(xaxis, series, restrictions)
    return JsonResponse(result)
