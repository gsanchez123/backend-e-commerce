# Imagen base liviana y específica para evitar vulnerabilidades
FROM node:23.11.0-alpine3.21

# Instala herramientas necesarias para compilar módulos nativos (como bcrypt)
RUN apk add --no-cache python3 make g++ bash

# se establece el directorio de trabajo
WORKDIR /app

# se copio solo los archivos de dependencias
COPY package*.json ./

#  dependencias sin las de desarrollo y recompilo  bcrypt dentro del contenedor
RUN npm ci --omit=dev \
    && npm rebuild bcrypt --build-from-source \
    && npm cache clean --force

# Copia el resto del proyecto
COPY . .

# Variables de entorno para evitar advertencias de producción
ENV NODE_ENV=production

# Expone el puerto definido 
EXPOSE 3000

# Comando por defecto para iniciar la app
CMD ["npm", "start"]

