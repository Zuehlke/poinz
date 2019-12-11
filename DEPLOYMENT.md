

PoinZ is currently deployed on a free-tier heroku dyno. (currently without persistent room storage)...



### Heroku deployment

* Build Docker image wiht ```$ npm run build```

* tag built image: ```$ docker tag <imageID> registry.heroku.com/poinz/web```

* Retrieve heroku auth token : ```$ heroku auth:token```. if you are not already logged in, ```$ heroku auth:login```

* login to heroku docker registry ```$ docker login -u=xeronimus@gmail.com registry.heroku.com``` (use the heroku auth token as password)

* push tagged image to heroku registry ```$ docker push registry.heroku.com/poinz/web```

* release new image ```$ heroku container:release web -a poinz``` (this will finally replace the currently running version on https://poinz.herokuapp.com)



A more suitable deployment might be needed in the future.

 
