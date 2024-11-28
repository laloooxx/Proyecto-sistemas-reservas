import { ParcelasEntity } from "../../parcelas/entity/parcelas.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("registro_parcelas")
export class Registro_parcelasEntity {
    @PrimaryGeneratedColumn('increment')
    id_reg_parcela: number;

    @Column({
        type: 'date',
    })
    f_ingreso: Date;
    
    @Column({
        type: 'date',
    })
    f_salida: Date;

    @Column({
        type: 'decimal',
        nullable: true
    })
    precio_total_parc: number;

    @Column({
        type: 'varchar',
        length: 10,
        unique: true
    })
    codigo_unico_parcela: string;
    
    @ManyToOne(() => ParcelasEntity, (parcela) => parcela.registro_parcela)
    @JoinColumn({ name: "num_parcela"})
    parcela: ParcelasEntity;

    @Column({type: 'int', nullable: true})
    id_usuario?: number;
}