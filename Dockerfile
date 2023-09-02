FROM node:alpine

WORKDIR /app

RUN apk add --no-cache \
    python \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
