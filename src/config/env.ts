import 'dotenv/config';
import * as joi from 'joi';


//creamos una interfaz para saber a q vamos a llamar y tener algo declarativo. Para utilizar el maximo potencial de ts declaramos la interfaz y definimos la estructura de las variables de entorno que se esperan, 7 en este caso
interface EnvVars {
    PORT: number;
    DB_DATABASE : string;
    DB_USER : string;
    DB_PASS : string;
    DB_HOST : string;
    DB_PORT : number;
    JWT_SEED : string;
}

//creamos una variable para almacenar un esquema joi, un esquema joi es un objeto el q validamos las propiedades de la interfaz 
//de la db xq trabajamos de local y trabajamos con root q no necesita passa, creamos el schema de joi
const envSchem = joi
//aca lo definimos como un objeto 
    .object({
        //poniendo el metodo required le decimos q es obligatorio
        PORT: joi.number().required(),
        DB_DATABASE : joi.string().required(),
        DB_USER : joi.string().required(),
        DB_PASS : joi.string().allow('').required(),
        DB_HOST : joi.string().required(),
        DB_PORT : joi.number().required(),
        JWT_SEED : joi.string().required(),
    })
    //le decimos q tamb nos traiga laas variables q no pedimos nosotros
    .unknown(true);
    console.log("el esquema de las variables de entorno es: ",envSchem);

//le pasamos todas las variables de entorno y le decimos q lo valide, capturando 2 parametros, el error para q diga cuando es un error y el value es el objeto creado anteriormente
const { error, value } = envSchem.validate(process.env);

//comparamos los datos q traemos del process.env con las del esquema joi, si hay un error, devolvemos un error con su mensaje de q es ele error
if (error) throw new Error(`Config vaalidation error: ${error.message}`);
//si no devuelve error, asignamos el valor del objeto esquema a la variable envVars q creamos en el momento
const envVars: EnvVars = value;


//creamos otro objeto q es el q vamos a usar y lo exportamos
export const envs = {
    port: envVars.PORT,
    database: envVars.DB_DATABASE,
    user : envVars.DB_USER,
    pass: envVars.DB_PASS,
    host: envVars.DB_HOST,
    dbPort: envVars.DB_PORT,
    jwt: envVars.JWT_SEED,
};