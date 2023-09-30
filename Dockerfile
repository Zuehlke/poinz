# let's use node 18.x  on Debian 11 ("bullseye")    see  https://hub.docker.com/_/node
FROM node:18-bullseye

# Create app directories
RUN mkdir -p /usr/src/poinz/public
RUN mkdir -p /usr/src/poinz/src
WORKDIR /usr/src/poinz

# Bundle app source
COPY deploy/public /usr/src/poinz/public
COPY deploy/src /usr/src/poinz/src
COPY deploy/package.json /usr/src/poinz/
COPY deploy/package-lock.json /usr/src/poinz/

# install app dependencies
RUN npm install --omit=dev

# expose port 3000
EXPOSE 3000

CMD npm start
