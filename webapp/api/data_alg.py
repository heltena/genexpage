from api.models import ColumnSpec, GeneData
from django.db import connection
from collections import defaultdict
import numpy as np


def get_column_names(restrictions):
    column_spec_query = ColumnSpec.objects
    for restriction in restrictions:
        dimension, op, value = restriction
        if dimension == "gene":
            continue
    
        elif dimension == "flu":
            if op == "eq":
                column_spec_query = column_spec_query.filter(flu=value)
            elif op == "in":
                column_spec_query = column_spec_query.filter(flu__in=value)
            else:
                raise Exception("op {} not valid at dimension {}".format(op, dimension))

        elif dimension == "age":
            if op == "eq":
                column_spec_query = column_spec_query.filter(age=value)
            elif op == "in":
                column_spec_query = column_spec_query.filter(age__in=value)
            else:
                raise Exception("op {} not valid at dimension {}".format(op, dimension))

        elif dimension == "tissue":
            if op == "eq":
                column_spec_query = column_spec_query.filter(tissue=value)
            elif op == "in":
                column_spec_query = column_spec_query.filter(tissue__in=value)
            else:
                raise Exception("op {} not valid at dimension {}".format(op, dimension))

        elif dimension == "replicate":
            if op == "eq":
                column_spec_query = column_spec_query.filter(replicate=value)
            elif op == "in":
                column_spec_query = column_spec_query.filter(replicate__in=value)
            else:
                raise Exception("op {} not valid at dimension {}".format(op, dimension))

        else:
            raise Exception("dimension {} not valid".format(dimension))

    return column_spec_query.all()


def get_where(restrictions):
    where = None
    for restriction in restrictions:
        dimension, op, value = restriction
        if dimension == "gene":
            if where is not None:
                raise Exception("gene restriction should appear alone")
            if op == "eq":
                where = "gene_ensembl={}".format(value)
            elif op == "in":
                where = "gene_ensembl IN ({})".format(", ".join(["'{}'".format(v) for v in value]))
    return where


def get_groups(columns, series):
    if series == "gene":
        return {}

    elif series == "flu":
        groups = defaultdict(list)
        for column in columns:
            groups[int(column.flu)].append(column.name)
        return groups

    elif series == "age":
        groups = defaultdict(list)
        for column in columns:
            groups[int(column.age)].append(column.name)
        return groups
    
    elif series == "tissue":
        groups = defaultdict(list)
        for column in columns:
            groups[column.tissue].append(column.name)
        return groups

    elif series == "replicate":
        groups = defaultdict(list)
        for column in columns:
            groups[int(column.replicate)].append(column.name)
        return groups

    else:
        raise Exception("serie {} not valid".format(series))


def generate_data_xaxis_gene(series, restrictions):
    columns = get_column_names(restrictions)
    groups = get_groups(columns, series)
    where = get_where(restrictions)
    columns = []
    for value in groups.values():
        columns.extend(value)

    if where is None:
        where = "1=1"

    query = "SELECT gene_ensembl, {} FROM api_genedata WHERE {} ORDER BY gene_ensembl ASC".format(", ".join(columns), where)

    v = GeneData.objects.raw(query)
    
    xvalues = []
    series_values = {}
    for key in groups.keys():
        series_values[key] = []

    for r in v:
        xvalues.append(r.gene_ensembl)
        for key, value in groups.items():
            v = [r.__getattribute__(k) for k in value if r.__getattribute__(k) is not None]
            if len(v) == 0:
                mean = 0.0
                std = 0.0
            else:
                mean = np.mean(v)
                std = np.std(v)
            series_values[key].append((mean, std))

    return {"ok": True,
            "xvalues": xvalues, 
            "series": series_values}

def generate_data_xaxis(xaxis, series, restrictions):
    columns = get_column_names(restrictions)
    groups = get_groups(columns, xaxis)
    where = get_where(restrictions)
    columns = []
    for value in groups.values():
        columns.extend(value)

    if where is None:
        where = "1=1"

    query = "SELECT gene_ensembl, {} FROM api_genedata WHERE {}".format(", ".join(columns), where)
    v = GeneData.objects.raw(query)
    
   
    xvalues = list(sorted(groups.keys()))
    series_values = {}
    for r in v:
        current_values = []
        for xvalue in xvalues:
            value = groups[xvalue]
            v = [r.__getattribute__(k) for k in value if r.__getattribute__(k) is not None]
            if len(v) == 0:
                mean = 0.0
                std = 0.0
            else:
                mean = np.mean(v)
                std = np.std(v)
            current_values.append((mean, std))
        series_values[r.gene_ensembl] = current_values

    return {"ok": True,
            "xvalues": xvalues,
            "series": series_values}

def generate_data(xaxis, series, restrictions):
    if xaxis == "gene":
        return generate_data_xaxis_gene(series, restrictions)
    else:
        return generate_data_xaxis(xaxis, series, restrictions)