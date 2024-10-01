import { ParcelasEntity } from "src/sist_reservas/parcelas/entity/parcelas.entity";
import { UsuariosEntity } from "src/sist_reservas/usuarios/entity/usuarios.entity";
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
    
    @ManyToOne(() => ParcelasEntity, (parcela) => parcela.registro_parcela)
    @JoinColumn({ name: "num_parcela"})
    parcela: ParcelasEntity;

    @ManyToOne(() => UsuariosEntity, (usuario) => usuario.registro_parcelas)
    @JoinColumn({name: "id"})
    usuario: UsuariosEntity;
}