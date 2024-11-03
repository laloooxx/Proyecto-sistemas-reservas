import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstadoReserva } from "../../../common/enum";
import { DepartamentosEntity } from "../../departamentos/entity/departamentos.entity";
import { UsuariosEntity } from "../../usuarios/entity/usuarios.entity";


@Entity("reservas_depto")
@Index(["desde", "hasta"])
export class ReservasDeptoEntity {
    @PrimaryGeneratedColumn('increment')
    id_reserva_depto: number;

    @Index()
    @Column({
        type: 'date',
    })
    desde: Date;

    @Index()
    @Column({
        type: 'date',
    })
    hasta: Date;

    @Column({
        type: 'enum',
        enum: EstadoReserva,
        default: EstadoReserva.PENDIENTE
    })
    estado_reserva: EstadoReserva;

    @Column({
        type: "decimal",
    })
    precio_total_depto: number;

    @Column({
        type: 'boolean',
        default: false
    })
    reserva_pagada: boolean;

    @Column({
        type: 'boolean',
        default: false
    })
    user_aprob_reserv: boolean;

    @CreateDateColumn({
        name: 'createdAt',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updatedAt',
    })
    updatedAt: Date;

    @ManyToOne(() => DepartamentosEntity, (departamento) => departamento.reservas_depto)
    @JoinColumn({ name: "id_depto"})
    departamento: DepartamentosEntity;

    @ManyToOne(() => UsuariosEntity, (usuario) => usuario.reservas)
    @JoinColumn({ name: "id"})
    usuario: UsuariosEntity;
}
