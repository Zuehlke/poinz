# PoinZ - Distributed Planning Poker

[![Build Status](https://travis-ci.org/Zuehlke/poinz.svg?branch=master)](https://travis-ci.org/Zuehlke/poinz)

PoinZ (/pɔɪnts/) is a simple web app for distributed teams in an agile setup. It allows to easily estimate items of interest (e.g. "stories").

The goal was to provide a ready-to-use tool without the hassle of registration/login, setup and a lot of configuration.

Checkout the App at [https://poinz.herokuapp.com/](https://poinz.herokuapp.com/)

![poinz_screenshot](https://user-images.githubusercontent.com/1777143/83323333-5c74b780-a25e-11ea-9629-48ae85b22215.png)

Similar tools are : https://www.pointingpoker.com/ or https://www.planningpoker.com/

## User Manual

Confused? Or you want to learn about hidden features? Read the [User Manual](./manual.md).

## Contribute

You can contribute in multiple ways...

* Maybe you have a feature request? Found a bug? General feedback? Please open a new [issue](https://github.com/Zuehlke/poinz/issues)
* You want to extend Poinz? Or fix one of the issues? Check out the [Development](#development) section.



### Development


### Prerequisites

* Install `nodeJS` at v10+ and `npm` at v6+.
* Install git
* Install `docker` if you want to build PoinZ

Fork & checkout the repository then install all npm dependencies.

`$ npm install`  (This will also install *client* and *server* npm dependencies)

Start the backend

`$ cd server/ && npm run start:dev`

Serve the client in dev mode via webpack-dev-server

`$ cd client/ && npm start`

Then you can open the app at http://localhost:9000/

#### Style

Run ```$ npm t``` in the root directory to lint all files and run tests.

#### Build

Our build produces a docker image that contains nodejs and our poinz server.
Make sure you have docker installed on your machine and your user is in the "docker" usergroup. (```$ sudo groupadd docker``` and ```$ sudo usermod -aG docker $USER```)

In project root, run

```
$ npm run build
```

This will copy all backend and client files to `deploy/`. 
And then start the docker build.

See [Deployment](DEPLOYMENT.md) for more information.

To start the newly built image locally, in detached mode with port forwarding:
```
$ docker run -p 3000:3000 -d xeronimus/poinz
```

## Architecture

### Technologies and Frameworks

The PoinZ Client is built with [ReactJS](https://facebook.github.io/react/) and [redux](https://github.com/reactjs/redux).
[Webpack](https://webpack.github.io/) serves as bundling tool.

The PoinZ Backend is a nodeJS [express](http://expressjs.com/) server.

Client and server communicate over websockets ([socket.io](https://socket.io/)).

### Command and Events documentation

Our backend handles commands sent by the client over a websocket connection.
Every command produces one or multiple events that modify the respective room (aka "aggregate").
Then the events are sent back to the client.

(Somewhat inspired by [CQRS](https://martinfowler.com/bliki/CQRS.html).)

See the generated [command and event docu](/server/docu/commandAndEventDocu.md);
