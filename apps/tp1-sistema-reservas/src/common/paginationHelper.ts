//definmos el numero max de elementos q se van a solicitar en una consulta, asi evitar sobrecargar la base de datos
export const  MAX_TAKE_PER_QUERY = 10;

//esta funcion toma un valor de tipo string y lo convierte en un número. Si el numero es mayor q la constante max_take_per_query devuelve max_take_per_query, asi aseguraamos q no manden mas elementos de los requeridos
export const formatTake = (value: string): number => {
    let x = Number(value);
    if (x > MAX_TAKE_PER_QUERY || Number.isNaN(x)) {
        x = MAX_TAKE_PER_QUERY;
    }

    return x;
}

//esta funcion convierte el valor de página de string a número. Si el valor no es un número válido, devuelve 1
export const formatPage = (value: string): number => Number(value) || 1;