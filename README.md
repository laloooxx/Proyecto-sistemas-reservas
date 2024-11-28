# Microservicio de Reservas de Departamentos y Registro de Parcelas

Este microservicio forma parte de una arquitectura de microservicios diseñada para gestionar reservas de parcelas y departamentos. Permite realizar check-in, check-out, calcular costos de estadía y consultar disponibilidad.

---

## **Características**
- **Gestión de reservas**: Registro de ingresos y salidas de parcelas y departamentos.
- **Validación de fechas**: Verificación de disponibilidad con base en fechas de entrada y salida.
- **Cálculo de costos**: Cálculo automático del costo total de la estadía.
- **Notificaciones por correo**: Integración con el microservicio de Mailer para notificar a los usuarios. (a futuro)
- **Soporte para paginación y búsqueda**: Listado eficiente de reservas y parcelas.

---

## **Tecnologías utilizadas**
- **NestJS**: Framework principal para el desarrollo del backend.
- **TypeORM**: ORM utilizado para interactuar con la base de datos.
- **RabbitMQ (TCP)**: Comunicación con el microservicio de Mailer y otros servicios.
- **date-fns**: Biblioteca para manejo avanzado de fechas.

---

## **Instalación y configuración**
### **Requisitos previos**
1. Tener instalado Node.js (versión 16 o superior) y npm.
2. Configurar una base de datos compatible (MySQL, PostgreSQL, etc.).
3. Tener TCP configurado y funcionando.

### **Pasos**
1. Clona el repositorio:
   A traves del bash
   - git clone https://github.com/laloooxx/Proyecto-sistemas-reservas
   - cd microservicio-reservas
   - Instar dependencias: npm install
   - Iniciamos el servidor en un entorno de desarrollo: npm run start:dev
   - Configura las variables de entorno en un archivo .env
  


Licencia
Este README está adaptado para ofrecer una descripción completa del microservicio, sus funcionalidades principales, e instrucciones detalladas para la instalación y uso. Si necesitas ajustes adicionales, no dudes en pedírmelo.
