FROM node:12 AS builder

COPY . /app
WORKDIR /app

RUN npm install \
  && npm run build --prod

FROM nginx:alpine
COPY --from=builder /app/dist/MagicDoor /usr/share/nginx/html

