export interface Gene {
    symbol: string;
    entrez: string;
    entrezNumber: number;
    ensembl: string;
}

export interface Sort {
    field: string;
    asc: boolean;
}