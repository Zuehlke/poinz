
PoinZ is currently deployed on a free-tier EC2 instance for testing purposes.

A more suitable deployment might be needed in the future.

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
