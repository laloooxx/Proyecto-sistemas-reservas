import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInCalendarDays } from 'date-fns';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { handleServiceError } from '../../common';
import { EstadoReserva } from '../../common/enum';
import { formatPage, formatTake, MAX_TAKE_PER_QUERY } from '../../common/paginationHelper';
import { PaginatorDto } from '../../common/paginatorDto';
import { Metadata, PaginatedReservas } from '../../common/types';
import { MAILER_SERVICE, USUARIO_SERVICE } from '../../config';
import { DepartamentosEntity } from '../departamentos/entity/departamentos.entity';
import { CreateReservaDto } from './entity/create_reservas_deptoDto';
import { ReservasDeptoEntity } from './entity/reservas_depto_entity';

@Injectable()
export class ReservasDeptoService {
    constructor(
        @InjectRepository(ReservasDeptoEntity)
        private readonly reservasService: Repository<ReservasDeptoEntity>,
        @Inject(MAILER_SERVICE)
        private readonly mailerService: ClientProxy,
        @InjectRepository(DepartamentosEntity)
        private readonly deptoService: Repository<DepartamentosEntity>,

        @Inject(USUARIO_SERVICE)
        private readonly usuarioClient: ClientProxy,

    ) {
    }


    private readonly logger = new Logger('ReservasServiceLogger')

    /**
     * @description Crea una nueva reserva de un departamento.
     * @param reservaDto la reserva del dto
     * @param id_depto el id del departamento
     * @returns La reserva creada
     */
    async crearReserva(reservaDto: CreateReservaDto, id_depto: number, id_usuario: number) {
        try {

            // Asegúrate de manejar errores aquí
            if (!reservaDto) {
                throw new RpcException('Datos inválidos');
            }
            if (!id_depto) {
                throw new RpcException('Departamento no encontrado');
            }

            // Verificar si el departamento existe
            const depto = await this.deptoService.findOne({
                where:
                    { id_depto }
            });
            if (!depto) {
                throw new RpcException('El departamento no existe');
            }

            if (!reservaDto.desde || !reservaDto.hasta) {
                throw new RpcException('Las fechas de reserva no son válidas');
            }


            if (reservaDto.hasta <= reservaDto.desde) {
                throw new RpcException('La fecha de salida no puede ser anterior o igual a la fecha de ingreso');
            }

            // Verificar si el departamento está disponible para las fechas solicitadas
            const reservaExistente = await this.reservasService.findOne({
                where: {
                    departamento: { id_depto },
                    //buscamos reservas cuyo campo "desde" sea menor o igual a reservaDto.hasta (la fecha de fin de la nueva reserva).Usamos dos nodos para determinar si el primero es menor o igual que el segundo
                    desde: LessThanOrEqual(reservaDto.hasta),
                    hasta: MoreThanOrEqual(reservaDto.desde)
                }
            });

            //Si el depto tiene reservas lo almacenamos en la variable reservasExistentes y devolvemos un error
            if (reservaExistente) {
                new RpcException('El departamento no está disponible para las fechas solicitadas');
            }




            //creamos la reserva
            const nuevaReserva = this.reservasService.create({
                ...reservaDto,
                departamento: depto,
                id_usuario,
                estado_reserva: EstadoReserva.APROBADA,
                precio_total_depto: 0
            });

            //guardamos la reserva
            await this.reservasService.save(nuevaReserva);
            console.log('Reserva guardada exitosamente');

            this.logger.log(`Reserva creada exitosamente para el departamento ID: ${id_depto} por el usuario ID: ${id_usuario}`);


            this.mailerService.emit('send-mail-reserva', { id_usuario, message: 'Reserva hecha correctamente' });
            //this.usuarioClient.emit('notify-user', { id_usuario, message: 'Reserva hecha correctamente' });


            return nuevaReserva;
        } catch (error) {
            this.logger.error(`Error creando reserva: ${error.message}`);
            handleServiceError(error);
        }
    }


    async registrarSalidaDepto(id_reserva_depto: number, hasta?: Date) {
        try {
            const reserva = await this.reservasService.findOne({
                where: { id_reserva_depto },
                relations: ['departamento']
            })
            if (!reserva) {
                throw new RpcException('No se ha encontrado la reserva')
            }

            if (reserva.estado_reserva === EstadoReserva.RECHAZADA) {
                throw new RpcException('La reserva fue rechazada')
            }

            const desde = new Date(reserva.desde);
            const hastaFinal = hasta ? new Date(hasta) : new Date(reserva.hasta || Date.now());

            // Verifica que las fechas sean válidas
            if (isNaN(desde.getTime()) || isNaN(hastaFinal.getTime())) {
                throw new RpcException('Las fechas proporcionadas no son válidas');
            }

            reserva.estado_reserva = EstadoReserva.TERMINADA;
            reserva.hasta = hastaFinal;
            reserva.reserva_pagada = true;

            const id_depto = reserva.departamento.id_depto
            //calculamos el precio total del departamento para las fechas de la reserva
            reserva.precio_total_depto = await this.calcularPrecioTotal(
                id_depto,
                desde,
                hastaFinal
            );

            await this.reservasService.save(reserva);

            return reserva;


        } catch (error) {
            handleServiceError(error);
        }
    }

    /**
     * @description Calcula el precio total de un departamento para las fechas de la reserva.
     * @param id_depto el id del departamento
     * @param desde desde cuando ingresa al departamento
     * @param hasta hasta cuando se va del departamento
     * @returns El precio total del departamento
     */
    async calcularPrecioTotal(id_depto: number, desde: Date, hasta: Date): Promise<number> {
        this.logger.log(`Buscando departamento con id: ${id_depto}`);

        const depto = await this.deptoService.findOne({ where: { id_depto: id_depto } });
        this.logger.log("DEPTO DESDE LA FUNCION PRECIO TOTAL", depto);
        if (!depto) {
            this.logger.error(`No se encontró un departamento con id: ${id_depto}`);
            throw new RpcException('El departamento no existe');
        }

        //extraemos el precio base del departamento, si viene null o undefined, lo seteamos en 0
        const precio_base_depto = depto.precio_base_depto ?? 0; // Usa `nullish coalescing` para mayor claridad
        if (precio_base_depto <= 0) {
            this.logger.error(`El departamento con id ${id_depto} tiene un precio base inválido: ${precio_base_depto}`);
            throw new RpcException('El departamento tiene un precio base inválido');
        }
        this.logger.log("precio_base_depto", precio_base_depto);


        // Validamos las fechas
        if (!desde || !hasta || isNaN(desde.getTime()) || isNaN(hasta.getTime())) {
            this.logger.error(`Fechas inválidas. Desde: ${desde}, Hasta: ${hasta}`)
            throw new RpcException('Fechas inválidas');
        }
        if (hasta <= desde) {
            this.logger.error(`La fecha de salida debe ser posterior a la fecha de entrada. Desde: ${desde}, Hasta: ${hasta}`);
            throw new RpcException('La fecha de salida debe ser posterior a la fecha de entrada');
        }
        //calculamos la cantidad de dias entre las fechas
        const dias = differenceInCalendarDays(hasta, desde) || 1;

        //calculamos el precio total, multiplicando el precio base por el numero de dias q se va a qeudar en el lugar
        const precio_total = precio_base_depto * dias;

        this.logger.log(`Precio total calculado: ${precio_total} para ${dias} día(s)`);
        return precio_total;
    }


    /**
     * @description Maneja las reservas múltiples de un departamento.
     * @param reservaDto la reserva del dto
     * @returns La reserva creada
     */
    async manejarReservasMultiples(reservaDto: CreateReservaDto, id_depto: number): Promise<CreateReservaDto> {
        try {
            //Verificamos si existen reservas para las mismas fechas
            const reservasExistentes = await this.reservasService.find({
                where: {
                    id_reserva_depto: id_depto,
                    desde: LessThanOrEqual(reservaDto.hasta),
                    hasta: MoreThanOrEqual(reservaDto.desde)
                }
            });

            // Verificamos si hay alguna reserva aprobada
            const reservaAprobada = reservasExistentes.find(reserva => reserva.estado_reserva === 'APROBADA');
            if (reservaAprobada) {
                throw new RpcException('Ya existe una reserva aprobada para estas fechas');
            }

            const precio_total_depto = await this.calcularPrecioTotal(
                id_depto,
                reservaDto.desde,
                reservaDto.hasta
            );

            //si solo hay reservas pendientes, podemos crear una nueva reserva pendiente
            const nuevaReserva = this.reservasService.create({
                ...reservaDto,
                estado_reserva: EstadoReserva.PENDIENTE,
                precio_total_depto
            });

            //guardar la nueva reserva
            const reservaGuardada = await this.reservasService.save(nuevaReserva);

            //si es la primer reserva pendiente para estas fechas, la aprobamos automáticamente
            if (reservasExistentes.length === 0) {
                reservaGuardada.estado_reserva = EstadoReserva.APROBADA;
                await this.reservasService.save(reservaGuardada);
            }


            return reservaGuardada;

        } catch (error) {
            handleServiceError(error);
        }
    }

    /**
     * @description Muestra todas las reservas.
     * @returns Todas las reservas
     */
    async mostrarReservas(query: PaginatorDto): Promise<PaginatedReservas> {
        try {
            //determina cuantos elemntos traer, usa formatTake para asegurar un valor valido
            const take = formatTake(query.take || MAX_TAKE_PER_QUERY.toString())
            //determina q pagina traer, usa formatPage para asegurar un valor valido
            const page = formatPage(query.page || '1');
            //calcula cuantos elemenntos saltear basado en la pagina y en el numero de elements x pagina
            const skip = (page - 1) * take;


            //creamos la consulta sql
            const queryBuilder = this.reservasService.createQueryBuilder('reserva');
            //usamos el query.search, asi q usamos el where para filtrar x nombre
            queryBuilder
                .select([
                    'reserva.id_reserva_depto',
                    'reserva.desde',
                    'reserva.hasta',
                    'reserva.estado_reserva',
                    'reserva.precio_total_depto',
                    'reserva.reserva_pagada',
                    'reserva.user_aprob_reserv',
                    'reserva.createdAt',
                    'reserva.updatedAt',
                    'reserva.id_usuario',
                    'departamento.id_depto', // Asegúrate de incluir este campo
                ])
                .leftJoin('reserva.departamento', 'departamento')


            //ejecutamos la consulta
            const [rows, count] = await queryBuilder
                //limitamos el numero de resultados
                .take(take)
                //salteamos los resultados de las paginas anteriores
                .skip(skip)
                //ejecutamos la consulta y devolvemos tanto los resultados como el conteo total
                .getManyAndCount()


            //calculamos el total de paginas dividiendo el total de items por los items x pagina
            const totalPages = Math.ceil(count / take);
            //y determinamos si hay una pagina siguiente
            const nextPage = page < totalPages ? page + 1 : null;

            //creamos un objeto con toda laa informacion de la paginacion 
            const metadata: Metadata = {
                itemsPerPage: take,
                totalPages,
                totalItems: count,
                currentPage: page,
                nextPage,
                searchTerm: query.search || ''
            }

            //y devolvemos los resultados (rows) y los metadatos
            return { rows, metadata }
        } catch (error) {
            handleServiceError(error);
        }
    }
}