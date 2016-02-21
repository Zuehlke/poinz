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
