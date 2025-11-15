FROM oven/bun:1

WORKDIR /usr/src/app

COPY package*.json ./

RUN bun install

COPY . .

EXPOSE 5000

CMD ["bunx", "run", "dev"]