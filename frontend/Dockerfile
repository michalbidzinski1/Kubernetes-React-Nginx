FROM node:14 AS build
WORKDIR /app
COPY ./package.json .
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html