from api.models import Meta, Counts, Genes
from django.db import connection
from collections import defaultdict
import numpy as np


def get_column_names(restrictions):
    meta_query = Meta.objects
    for restriction in restrictions:
        dimension, op, value = restriction
        if dimension == "gene":
            continue
    
        elif dimension == "pfu":
            if op == "eq":
                meta_query = meta_query.filter(pfu=value)
            elif op == "in":
                meta_query = meta_query.filter(pfu__in=value)
            else:
                raise Exception("op {} not valid at dimension {}".format(op, dimension))

        elif dimension == "age":
            if op == "eq":
                meta_query = meta_query.filter(age=value)
            elif op == "in":
                meta_query = meta_query.filter(age__in=value)
            else:
                raise Exception("op {} not valid at dimension {}".format(op, dimension))

        elif dimension == "tissue":
            if op == "eq":
                meta_query = meta_query.filter(tissue=value)
            elif op == "in":
                meta_query = meta_query.filter(tissue__in=value)
            else:
                raise Exception("op {} not valid at dimension {}".format(op, dimension))

        elif dimension == "experimental_batch":
            if op == "eq":
                meta_query = meta_query.filter(experimental_batch=value)
            elif op == "in":
                meta_query = meta_query.filter(experimental_batch__in=value)
            else:
                raise Exception("op {} not valid at dimension {}".format(op, dimension))

        else:
            raise Exception("dimension {} not valid".format(dimension))

    return meta_query.all()


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
    if series == "pfu":
        groups = defaultdict(list)
        for column in columns:
            groups[int(column.pfu)].append(column.name)
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

    elif series == "experimental_batch":
        groups = defaultdict(list)
        for column in columns:
            groups[int(column.experimental_batch)].append(column.name)
        return groups

    else:
        raise Exception("serie {} not valid".format(series))


def get_xvalues_groups(columns, xaxis, series):
    xvalues = set()
    for column in columns:
        if xaxis in ['pfu', 'age', 'experimental_batch']:
            xvalues.add(int(column.__getattribute__(xaxis)))
        elif xaxis in ["tissue"]:
            xvalues.add(column.__getattribute__(xaxis))
    xvalues = sorted(list(xvalues))

    if series == xaxis:
        raise Exception("xaxis {} cannot be the same as series".format(xaxis))
    
    groups = defaultdict(list)
    for column in columns:
        if xaxis in ['pfu', 'age', 'experimental_batch']:
            k1 = int(column.__getattribute__(xaxis))
        elif xaxis in ['tissue']:
            k1 = column.__getattribute__(xaxis)
        else:
            raise Exception("xaxis {} not valid".format(xaxis))
        
        if series in ['pfu', 'age', 'experimental_batch']:
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
        if xaxis in ['pfu', 'age', 'experimental_batch']:
            xvalues.add(int(column.__getattribute__(xaxis)))
        elif xaxis in ["tissue"]:
            xvalues.add(column.__getattribute__(xaxis))
    xvalues = sorted(list(xvalues))

    groups = defaultdict(list)
    for column in columns:
        if xaxis in ['pfu', 'age', 'experimental_batch']:
            k1 = int(column.__getattribute__(xaxis))
        elif xaxis in ['tissue']:
            k1 = column.__getattribute__(xaxis)
        else:
            raise Exception("xaxis {} not valid".format(xaxis))
        
        groups[k1].append(column.name)
    return xvalues, groups


def convert_gene_family_name(ens, family):
    if family == "ENS":
        return ens
    try:
        values = Genes.objects.filter(gene_ensembl=ens)
        if len(values) == 0:
            return ens
        value = values[0]
        if family == "Chr":
            return value.Chr
        elif family == "NCBI":
            return value.symbol_ncbi
        else:
            return ens
    except:
        return ens


def generate_data_xaxis_gene(series, restrictions, geneFamilyName):
    columns = get_column_names(restrictions)
    groups = get_groups_gene(columns, series)
    where = get_where(restrictions)
    columns = []
    for value in groups.values():
        columns.extend(value)

    if where is None:
        where = "1=1"

    query = "SELECT gene_ensembl, {} FROM api_counts WHERE {} ORDER BY gene_ensembl ASC".format(", ".join(columns), where)

    v = Counts.objects.raw(query)
    
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

    xvalues = [convert_gene_family_name(x, geneFamilyName) for x in xvalues]
    return {"ok": True,
            "xaxis": "gene",
            "xvalues": xvalues, 
            "series": series_values}


def generate_data_series_gene(xaxis, restrictions, geneFamilyName):
    columns = get_column_names(restrictions)
    xvalues, groups = get_xvalues_serie_gene(columns, xaxis)
    where = get_where(restrictions)
    columns = []
    for value in groups.values():
        columns.extend(value)

    if where is None:
        where = "1=1"

    query = "SELECT gene_ensembl, {} FROM api_counts WHERE {} ORDER BY gene_ensembl ASC".format(", ".join(columns), where)

    v = Counts.objects.raw(query)

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

    new_series_values = {}
    for k, v in series_values.items():
        new_k = convert_gene_family_name(k, geneFamilyName)
        proposed_new_k = new_k
        count = 1
        while proposed_new_k in new_series_values:
            proposed_new_k = "{}_{}".format(new_k, count)
            count += 1
        new_series_values[proposed_new_k] = v

    return {"ok": True,
            "xaxis": xaxis,
            "xvalues": xvalues,
            "series": new_series_values}


def generate_data_xaxis(xaxis, series, restrictions):
    columns = get_column_names(restrictions)
    xvalues, groups = get_xvalues_groups(columns, xaxis, series)
    where = get_where(restrictions)
    columns = []
    for value in groups.values():
        columns.extend(value)

    if where is None:
        where = "1=1"

    query = "SELECT gene_ensembl, {} FROM api_counts WHERE {}".format(", ".join(columns), where)

    v = Counts.objects.raw(query)

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


def generate_data(xaxis, series, restrictions, geneFamilyName):
    if xaxis == "gene":
        return generate_data_xaxis_gene(series, restrictions, geneFamilyName)
    elif series == "gene":
        return generate_data_series_gene(xaxis, restrictions, geneFamilyName)
    else:
        return generate_data_xaxis(xaxis, series, restrictions)