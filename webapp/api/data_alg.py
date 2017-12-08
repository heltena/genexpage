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


def get_groups_gene(columns, series):
    if series == "flu":
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


def get_xvalues_groups(columns, xaxis, series):
    xvalues = set()
    for column in columns:
        if xaxis in ['flu', 'age', 'replicate']:
            xvalues.add(int(column.__getattribute__(xaxis)))
        elif xaxis in ["tissue"]:
            xvalues.add(column.__getattribute__(xaxis))
    xvalues = sorted(list(xvalues))

    if series == xaxis:
        raise Exception("xaxis {} cannot be the same as series".format(xaxis))
    
    groups = defaultdict(list)
    for column in columns:
        if xaxis in ['flu', 'age', 'replicate']:
            k1 = int(column.__getattribute__(xaxis))
        elif xaxis in ['tissue']:
            k1 = column.__getattribute__(xaxis)
        else:
            raise Exception("xaxis {} not valid".format(xaxis))
        
        if series in ['flu', 'age', 'replicate']:
            k2 = int(column.__getattribute__(series))
        elif series in ['tissue']:
            k2 = column.__getattribute__(series)
        else:
            raise Exception("series {} not valid".format(xaxis))
        
        groups[(k1, k2)].append(column.name)
    return xvalues, groups


def get_xvalues_serie_gene(columns, xaxis):
    xvalues = set()
    for column in columns:
        if xaxis in ['flu', 'age', 'replicate']:
            xvalues.add(int(column.__getattribute__(xaxis)))
        elif xaxis in ["tissue"]:
            xvalues.add(column.__getattribute__(xaxis))
    xvalues = sorted(list(xvalues))

    groups = defaultdict(list)
    for column in columns:
        if xaxis in ['flu', 'age', 'replicate']:
            k1 = int(column.__getattribute__(xaxis))
        elif xaxis in ['tissue']:
            k1 = column.__getattribute__(xaxis)
        else:
            raise Exception("xaxis {} not valid".format(xaxis))
        
        groups[k1].append(column.name)
    return xvalues, groups


def generate_data_xaxis_gene(series, restrictions):
    columns = get_column_names(restrictions)
    groups = get_groups_gene(columns, series)
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
                mean = np.nanmean(v)
                std = np.nanstd(v)
            series_values[key].append((mean, std))

    return {"ok": True,
            "xaxis": "gene",
            "xvalues": xvalues, 
            "series": series_values}


def generate_data_series_gene(xaxis, restrictions):
    columns = get_column_names(restrictions)
    xvalues, groups = get_xvalues_serie_gene(columns, xaxis)
    where = get_where(restrictions)
    columns = []
    for value in groups.values():
        columns.extend(value)

    if where is None:
        where = "1=1"

    query = "SELECT gene_ensembl, {} FROM api_genedata WHERE {} ORDER BY gene_ensembl ASC".format(", ".join(columns), where)

    v = GeneData.objects.raw(query)

    series_values = defaultdict(list)
    for r in v:
        serie = r.gene_ensembl
        for xvalue in xvalues:
            columns = groups[xvalue]
            v = [r.__getattribute__(k) for k in columns if r.__getattribute__(k) is not None]
            if len(v) == 0:
                mean = 0.0
                std = 0.0
            else:
                mean = np.nanmean(v)
                std = np.nanstd(v)
            series_values[serie].append((mean, std))

    return {"ok": True,
            "xaxis": xaxis,
            "xvalues": xvalues,
            "series": series_values}


def generate_data_xaxis(xaxis, series, restrictions):
    columns = get_column_names(restrictions)
    xvalues, groups = get_xvalues_groups(columns, xaxis, series)
    where = get_where(restrictions)
    columns = []
    for value in groups.values():
        columns.extend(value)

    if where is None:
        where = "1=1"

    query = "SELECT gene_ensembl, {} FROM api_genedata WHERE {}".format(", ".join(columns), where)
    print(query)
    print(dict(groups))

    v = GeneData.objects.raw(query)

    series_data = {serie_key: defaultdict(list) for axis_key, serie_key in groups.keys()}
    for r in v:
        for xvalue in groups.keys():
            axis_key, serie_key = xvalue
            for column_name in groups[xvalue]:
                new_value = r.__getattribute__(column_name)
                if new_value is not None:
                    series_data[serie_key][axis_key].append(new_value)

    series_values = defaultdict(list)

    for serie_key, axis in series_data.items():
        axis_data = {}
        for axis_key, axis_values in axis.items():
            if len(axis_values) == 0:
                mean = 0.0
                std = 0.0
            else:
                mean = np.nanmean(axis_values)
                std = np.nanstd(axis_values)
            axis_data[axis_key] = (mean, std)
        for xvalue in xvalues:
            series_values[serie_key].append(axis_data.get(xvalue, (0.0, 0.0)))

    return {"ok": True,
            "xaxis": xaxis,
            "xvalues": xvalues,
            "series": series_values}


def generate_data(xaxis, series, restrictions):
    if xaxis == "gene":
        return generate_data_xaxis_gene(series, restrictions)
    elif series == "gene":
        return generate_data_series_gene(xaxis, restrictions)
    else:
        return generate_data_xaxis(xaxis, series, restrictions)