import { ReservasDeptoEntity } from 'src/sist_reservas/reservas_depto/entity/reservas_depto_entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'

@Entity("departamentos") 
export class DepartamentosEntity {
    @PrimaryGeneratedColumn('increment')
    id_depto: number;

    @Column({
        type:'varchar',
        length: 100,
        nullable: false
    })
    nombre: string;

    @Column({ 
        type: 'int',
        nullable: false
    })
    numero_depto: number;

    @Column({
        type: 'decimal',
        nullable: true
    })
    precio_base_depto: number;

    @Column({
        type: 'int',
        nullable: true
    })
    capacidad: number;

    @OneToMany(DepartamentosEntity => ReservasDeptoEntity, reserva => reserva.departamento)
    reservas_depto: ReservasDeptoEntity[];
};