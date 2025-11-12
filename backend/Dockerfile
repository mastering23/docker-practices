
# Imagen base de Node.js
FROM node:alpine


WORKDIR /app


COPY package.json .


RUN npm install

# Copiar código fuente
COPY . .


EXPOSE 5000

CMD ["npm", "start"]
