from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from api.tags import method
from collections import defaultdict
import json
import numpy as np
from api.data_alg import generate_time_series, generate_age_counts
from api.models import Age, Pfu, ExperimentalBatch, Genes, Tissue, Version


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
def gene_search(request, text):
    genes = Genes.objects.filter(
        Q(gene_ensembl__icontains=text) | 
        Q(Chr__icontains=text) |
        Q(symbol_ncbi__icontains=text)).order_by("symbol_ncbi")[0:11]

    values = []
    for value in genes[0:10]:
        values.append([value.symbol_ncbi, value.gene_ncbi, value.gene_ensembl])

    result = {
        "searchText": text,
        "hasMore": len(genes) == 11,
        "values": values
    }
    return JsonResponse(result)


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
def experimentalbatch_list(request):
    experimentalbatches = ExperimentalBatch.objects.all().order_by("name")
    result = [t.name for t in experimentalbatches]
    return JsonResponse(result, safe=False)


@csrf_exempt
@method(allowed=['GET'])
def gene_list(request):
    genes = Genes.objects.all().order_by("gene_ensembl")
    result = [[g.gene_ensembl, g.symbol_ncbi, g.gene_ncbi] for g in genes]
    return JsonResponse(result, safe=False)


@csrf_exempt
@method(allowed=['GET'])
def dataset_version(request):
    version = None
    for current in Version.objects.all():
        if version is None:
            version = current
        else:
            print("E: More than one version")

    result = {}
    if version is not None:
        result["version"] = [version.name, version.timestamp]
    else:
        result["version"] = ["no-version", "no-timestamp"]
        print("E: There is no version!")
    return JsonResponse(result)



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
    geneIdentifier = body.get("geneIdentifier", "GENE_SYMBOL")
    title = body.get("title", "")
    xAxisLabel = body.get("xAxisLabel", "")
    yAxisLabel = body.get("yAxisLabel", "") 
    if xaxis is None:
        result = {"ok": False,
                  "message": "xaxis not valid"}
        return JsonResponse(result)

    if series is None:
        result = {"ok": False,
                  "message": "series not valid"}
        return JsonResponse(result)

    result = generate_time_series(xaxis, series, restrictions, geneIdentifier, title, xAxisLabel, yAxisLabel)
    return JsonResponse(result)


@csrf_exempt
@method(allowed=['POST'])
def age_counts(request):
    body = json.loads(request.body.decode("utf-8"))
    restrictions = body.get("restrictions", [])
    geneIdentifier = body.get("geneIdentifier", "GENE_SYMBOL")
    title = body.get("title", "")
    xAxisLabel = body.get("xAxisLabel", "")
    yAxisLabel = body.get("yAxisLabel", "") 

    version = None
    for current in Version.objects.all():
        if version is None:
            version = current
        else:
            print("E: More than one version")

    result = generate_age_counts(restrictions, geneIdentifier, title, xAxisLabel, yAxisLabel)
    if version is not None:
        result["version"] = [version.name, version.timestamp]
    else:
        result["version"] = ["no-version", "no-timestamp"]
        print("E: There is no version!")
    return JsonResponse(result)
    