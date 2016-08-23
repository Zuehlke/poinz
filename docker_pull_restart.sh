#!/bin/sh

# This script pulls the "latest" poinz image from the docker hub and restarts the running "poinz" container

# list running docker containers
echo "---- listing running docker containers ----"
docker ps

# pull newest poinz image
echo "---- pulling newest image 'poinz' ----"
docker pull xeronimus/poinz:latest

# stop running
echo "---- stopping running docker container 'poinz' ----"
docker stop poinz

# remove "poinz" container
echo "---- deleting docker container 'poinz' ----"
docker rm poinz

# start new "poinz" container (will automatically pull from repo)
echo "---- starting new container ----"
docker run --name poinz --link redis:db -p 8080:3000 -d xeronimus/poinz:latest

