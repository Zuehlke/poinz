# PoinZ - Distributed Planning Poker

[![Build Status](https://travis-ci.org/Zuehlke/poinz.svg?branch=master)](https://travis-ci.org/Zuehlke/poinz)

PoinZ (/pɔɪnts/) is a simple web app for distributed teams in an agile setup. It allows to easily estimate items of interest (e.g. "stories").

The goal was to provide a ready-to-use tool without the hassle of registration/login, setup and a lot of configuration.

Checkout the App at [poinz.zuehlke.io](http://poinz.zuehlke.io/)

![poinz_screenshot](https://cloud.githubusercontent.com/assets/1777143/13347877/846c4630-dc70-11e5-8c04-e5a03d18645d.png)

Similar tools are : https://www.pointingpoker.com/ or https://www.planningpoker.com/

## Technologies and Frameworks

The PoinZ Client is built with [ReactJS](https://facebook.github.io/react/) and [redux](https://github.com/reactjs/redux).
[Webpack](https://webpack.github.io/) serves as bundling tool.

The PoinZ Backend is a nodeJS [express](http://expressjs.com/) server.


## Contribute

### Prerequisites

* You have `nodeJS` installed at v4.2.0+ and `npm` at v2.0.0+.
* You are familiar with `npm`
* You are familiar with `git`
* You know JavaScript (duh :-) )
* You are familiar with- or eager to learn `react`
* You are familiar with- or eager to learn `redux`

### Style

Try to adhere to the [airbnb style guide](https://github.com/airbnb/javascript).

### Development

### Prerequisites

* Install nodejs
* Install git
* Install redis (as of https://github.com/Zuehlke/poinz/issues/8 rooms are persisted). See [Deployment](DEPLOYMENT.md) for more information.

Fork & checkout the repository then install all npm dependencies.

`$ npm install`  (This will also install *client* and *server* npm dependencies)

Start the backend

`$ cd server/ && npm start`

Start the client-serving in dev mode via webpack-dev-server

`$ cd client/ && npm run serve`

Then you can open the app at http://localhost:9000/webpack-dev-server/


## Build

Our build produces a docker image that contains nodejs and our poinz server.
Make sure you have docker installed on your machine and your user is in the "docker" usergroup.

### 1. Install client npm dependencies

Since we bundle our client, we need all dependencies installed.

```
$ npm i
$ cd client
$ npm i
```

### 2. Build & Pack for deployment

In project root, run

```
$ npm run build
```

This will copy all backend and client files to `deploy/`. 
And then start the docker build.

See [Deployment](DEPLOYMENT.md) for more information.
