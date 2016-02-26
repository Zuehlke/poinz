# PoinZ - Distributed Planning Poker

PoinZ (/pɔɪnts/) is a simple web app for distributed teams in an agile setup. It allows to easily estimate items of interest (e.g. "stories").

The goal was to provide a ready-to-use tool without the hassle of registration/login, setup and a lot of configuration.

![poinz_screenshot](https://cloud.githubusercontent.com/assets/1777143/13347877/846c4630-dc70-11e5-8c04-e5a03d18645d.png)

Similar tools are : https://www.pointingpoker.com/ or https://www.planningpoker.com/

## Technologies and Frameworks

The PoinZ Client is built with [ReactJS](https://facebook.github.io/react/) and [redux](https://github.com/reactjs/redux).
[Webpack](https://webpack.github.io/) serves as bundling tool.

The Poinz Backend is a nodeJS [express](http://expressjs.com/) server.


## Contribute

### Prerequisites

* You have `node` installed at v4.0.0+ and `npm` at v2.0.0+.
* You are familiar with `npm`
* You are familiar with `git`
* You know JavaScript (duh :-) )
* You are familiar with- or eager to learn react
* You are familiar with- or eager to learn redux


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
 npm i
$ cd client
$ npm i
```

### 2. Build & Pack for deployment

In project root, run

```
$ gulp packForDeployment
```

### Amazon EC2 deployment

I did setup a free-tier ubuntu EC2 instance and installed nodejs

- connect to the EC2 instance via ssh (user is "ubuntu", not "ec2-user" !)
- https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
- sudo apt-get install git
- port forwarding (see below)

3. push new version to orphan branch "deployment"

4. checkout new version of "deployment" branch on EC2 instance (/home/ubuntu/git/poinz)

5. restart app (pm2 ) https://www.npmjs.com/package/pm2

### port forwarding:

(see also https://gist.github.com/kentbrew/776580)

list routing chains in iptable
`sudo iptables -t nat -L`

remove routing from iptable
`sudo iptables -t nat -D PREROUTING 1`

add correct forward from 80 to 8080
`sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000`
