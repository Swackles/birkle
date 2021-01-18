FROM node:14-alpine AS build
WORKDIR /birkle

COPY package*.json /birkle/
RUN npm install

COPY tsconfig.json /birkle/
COPY src /birkle/src/
RUN npm run build

RUN cd dist/migrations

RUN rm dist/migrations/*.js.map


FROM node:14-alpine
RUN apk add nodejs bash --no-cache
WORKDIR /birkle

COPY --from=build /birkle/dist /birkle/
COPY package*.json /birkle/

RUN npm install --production

CMD node app.js