FROM node:18-bullseye

WORKDIR /usr/src/poinz

COPY client/dist /usr/src/poinz/public

COPY server/package.json /usr/src/poinz/
COPY server/package-lock.json /usr/src/poinz/
ENV NODE_ENV=production

COPY server/src /usr/src/poinz/src

RUN npm install --omit=dev

EXPOSE 3000

CMD npm start
