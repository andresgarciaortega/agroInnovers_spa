# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
COPY vite.config.js ./
COPY ./src ./src
COPY ./public ./public

# Instala las dependencias
RUN npm install

# Expone el puerto que usa Vite
EXPOSE 5173

# Comando para iniciar Vite
CMD ["npm", "run", "dev", "--", "--host"]
