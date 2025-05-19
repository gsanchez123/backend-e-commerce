// config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Backend eCommerce API',
      version: '1.0.0',
      description: 'Documentación de la API de usuarios, productos, carritos, tickets y más.',
      contact: {
        name: 'Gonzalo Sánchez',
        email: 'tuemail@ejemplo.com',
        url: 'https://github.com/gsanchez123',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
      {
        url: 'https://miproyecto-en-produccion.com',
        description: 'Servidor en producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
