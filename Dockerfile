# development environment
FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# build environment
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# production environment
FROM nginx:stable
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/templates /etc/nginx/templates
COPY ./nginx/server.crt /etc/nginx/server.crt
COPY ./nginx/server.key /etc/nginx/server.key
EXPOSE 3000
