# PoinZ docker file

# For the following commands, we expect that your user is part of the "docker" usergroup
# (then you can run the docker command without "sudo")

# use the following command to build
# docker build -t xeronimus/poinz .

# start the container with interactive shell
# docker run -i -t xeronimus/poinz /bin/bash

# start the container locally in detached mode
# docker run -p 3000:3000 -d xeronimus/poinz

FROM node:lts-jessie

# Create app directory
RUN mkdir -p /usr/src/poinz/public
RUN mkdir -p /usr/src/poinz/lib
WORKDIR /usr/src/poinz

# Bundle app source
COPY deploy/public /usr/src/poinz/public
COPY deploy/lib /usr/src/poinz/lib
COPY deploy/resources /usr/src/poinz/resources
COPY deploy/package.json /usr/src/poinz/

# install app dependencies
RUN npm install --production

# expose port 3000
EXPOSE 3000

CMD npm start
