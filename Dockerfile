FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "./src/server.js"]

#docker build --tag node-docker .
#docker run -p 8080:8080 -d node-docker
