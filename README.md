# Distributed Planning Poker


# Client


# Server


## Redhat Openshift deployment

Distributed Planning Poker can be deployed on redhat openshift.
Since the default nodeJS cartridge only supports nodejs 0.10.x, I used a custom one that can be found here https://github.com/icflorescu/openshift-cartridge-nodejs

1. Install npm dependencies
```
$ npm i
$ cd client
$ npm i
```

2. Build & Pack for deployment

In project root, run
```
$ gulp packForDeployment
```


3. clone openshift repo 
```
$ cd my/gitrepos/
$ git clone ssh://56c8223f89f5cf9c9e00004f@poker-xeronimus.rhcloud.com/~/git/poker.git/ splush-openshift
```

4. copy contents of splush/deploy and push

- Copy all files in splush/deploy to the splush-openshift folder.
- commit everything (master branch)
- push master branch


For more information, see https://blog.openshift.com/run-your-nodejs-projects-on-openshift-in-two-simple-steps/


## Amazon EC2 deployment


I did setup a free-tier ubuntu EC2 instance and installed nodejs 

- connect to the EC2 instance via ssh (user is "ubuntu", not "ec2-user" !)
- https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
- sudo apt-get install git
- port forwarding etc : http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2

1. & 2. same as for Openshift

3. zip deploy/ folder and upload to EC2 with scp

4. 

### port forwarding:

list routing chains in iptable
`sudo iptables -t nat -L`

remove routing from iptable
`sudo iptables -t nat -D PREROUTING 1`

add correct forward from 80 to 8080
`sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000`
