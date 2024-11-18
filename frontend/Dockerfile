FROM node:20.11.0-alpine

WORKDIR /app

COPY . /app/
RUN yarn install

RUN yarn run build

RUN yarn global add serve
CMD ["serve", "-s", "dist"]
