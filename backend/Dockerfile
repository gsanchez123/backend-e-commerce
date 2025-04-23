# Imagen base liviana y específica para evitar vulnerabilidades
FROM node:23.11.0-alpine3.21

# Instala herramientas necesarias para compilar módulos nativos (como bcrypt)
RUN apk add --no-cache python3 make g++ bash

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos solo los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias sin las de desarrollo y recompilamos bcrypt dentro del contenedor
RUN npm ci --omit=dev \
    && npm rebuild bcrypt --build-from-source \
    && npm cache clean --force

# Copiamos el resto del proyecto
COPY . .

# Variables de entorno para evitar advertencias de producción
ENV NODE_ENV=production

# Exponemos el puerto definido en tu app
EXPOSE 3000

# Comando por defecto para iniciar la app
CMD ["npm", "start"]

