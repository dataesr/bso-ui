FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# production environment
FROM nginx:stable
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/templates /etc/nginx/templates
EXPOSE 3000
