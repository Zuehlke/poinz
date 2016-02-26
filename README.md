# PoinZ - Distributed Planning Poker

PoinZ (/pɔɪnts/) is a simple web app for distributed teams in an agile setup. It allows to easily estimate items of interest (e.g. "stories").

The goal was to provide a ready-to-use tool without the hassle of registration/login, setup and a lot of configuration.

![poinz_screenshot](https://cloud.githubusercontent.com/assets/1777143/13347877/846c4630-dc70-11e5-8c04-e5a03d18645d.png)

Similar tools are : https://www.pointingpoker.com/ or https://www.planningpoker.com/

## Technologies and Frameworks

The PoinZ Client is built with [ReactJS](https://facebook.github.io/react/) and [redux](https://github.com/reactjs/redux).
[Webpack](https://webpack.github.io/) serves as bundling tool.

The PoinZ Backend is a nodeJS [express](http://expressjs.com/) server.


## Contribute

### Prerequisites

* You have `node` installed at v4.0.0+ and `npm` at v2.0.0+.
* You are familiar with `npm`
* You are familiar with `git`
* You know JavaScript (duh :-) )
* You are familiar with- or eager to learn `react`
* You are familiar with- or eager to learn `redux`

### Development

Fork & checkout the repository then install all npm dependencies.

`$ npm install`

`$ cd client/ && npm install`

`$ cd server/ && npm install`

Start the backend

`$ cd server/ && npm start`

Start the client-serving in dev mode via webpack-dev-server

`$ cd client/ && npm run serve`

Then you can open the app at http://localhost:9000/webpack-dev-server/



## Build

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
$ gulp packForDeployment
```

This will copy all backend and client files to `deploy/`.

See [Deployment](DEPLYOMENT.md) for more information.
