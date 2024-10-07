import { Registro_parcelasEntity } from "../../registro_parcelas/entity/regist_parc_entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadoParcela } from "../../../common/enum";


@Entity("parcelas")
export class ParcelasEntity {
    @PrimaryGeneratedColumn('increment')
    id_parcela: number;

    @Column({
        type: 'decimal',
        nullable: false
    })
    precio_base_parc: number;


    @Column({
        type: 'enum',
        enum: EstadoParcela,
        default: EstadoParcela.DISPONIBLE
    })
    estado_parcela: EstadoParcela;

    @OneToMany(() => Registro_parcelasEntity, registro => registro.parcela)
    registro_parcela: Registro_parcelasEntity[];
}