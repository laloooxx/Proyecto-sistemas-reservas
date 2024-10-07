import { ReservasDeptoDto } from '../sist_reservas/reservas_depto/entity/reservas_deptoDto'
import { Registro_parcelasDto } from '../sist_reservas/registro_parcelas/entity/regist_parcDto'


export interface Metadata {
    totalPages: number
    totalItems: number
    itemsPerPage: number
    currentPage: number
    searchTerm: string
    nextPage: number | null
};

export interface PaginatedReservas {
    metadata: Metadata
    rows: ReservasDeptoDto[]
}

export interface PaginatorRegistroParcelas {
    metadata: Metadata
    rows: Registro_parcelasDto[]
}