#!/bin/bash/

# This script pulls the "latest" poinz image from the docker hub and restarts the running "poinz" container

# list running docker containers
docker ps

# stop running
docker stop poinz

# remove "poinz" container
docker rm poinz

# start new "poinz" container (will automatically pull from repo)
docker run --name poinz --link redis:db -p 8080:3000 -d xeronimus/poinz:latest

