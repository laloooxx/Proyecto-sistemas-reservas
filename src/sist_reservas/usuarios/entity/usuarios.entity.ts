import { DepartamentosEntity } from "src/sist_reservas/departamentos/entity/departamentos.entity";
import { Registro_parcelasEntity } from "src/sist_reservas/registro_parcelas/entity/regist_parc_entity";
import { ReservasDeptoEntity } from "src/sist_reservas/reservas_depto/entity/reservas_depto_entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "src/common";


@Entity('usuarios')
export class UsuariosEntity {
    @PrimaryGeneratedColumn('increment')
    //id_user?
    id: number;

    @Column({
        type: 'varchar', 
        unique: true,
        length: 255,
        nullable: false
    })
    nombre: string;

    @Column({
        type: 'varchar', 
        length: 255,
        nullable: false,
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar', 
        nullable: false
    })
    password: string;

    @Column({
        type: 'bool',
        default: true,
    })
    isActive?: boolean;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 255
    })
    avatar?: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: 'client'
    })
    role?: Role;

    @OneToMany(() => ReservasDeptoEntity, reserva => reserva.usuario)
    reservas: ReservasDeptoEntity[];

    @OneToMany(() => Registro_parcelasEntity, registro => registro.usuario)
    registro_parcelas: Registro_parcelasEntity[];
}