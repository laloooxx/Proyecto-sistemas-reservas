import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("historial_pagos")
export class Historial_pagosEntity {
    @PrimaryGeneratedColumn('increment')
    id_hist_pago: number;

    @Column({
        type: 'decimal',
        nullable: false,
    })
    precio_base_parc: number;

    @Column({
        type: 'decimal',
        nullable: false,
    })
    precio_total_parc: number;

    @Column({
        type: 'decimal',
        nullable: false,
    })
    precio_base_depto: number;
    
    @Column({ 
        type: 'decimal',
        nullable: false,
    })
    precio_total_depto: number;
}