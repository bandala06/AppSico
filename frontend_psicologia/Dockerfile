# Usamos Node 20
FROM node:20-alpine

WORKDIR /app

# Copiamos dependencias e instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# CRA usa el 3000 por defecto
EXPOSE 3000

# El comando de arranque para Create React App
CMD ["npm", "start"]