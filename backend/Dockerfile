# Dockerise the backend first
FROM node:19.2-slim as backend
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 4000
CMD npm run start