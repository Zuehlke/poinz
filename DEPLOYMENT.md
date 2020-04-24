

PoinZ is currently deployed on a free-tier heroku dyno. (currently without persistent room storage)...



### Heroku deployment

* Build Docker image with ```$ npm run build```

* Retrieve heroku auth token : ```$ heroku auth:token```. (If you are not already logged in, you have to login first: ```$ heroku auth:login``` ).

* login to heroku's docker registry ```$ docker login -u=xeronimus@gmail.com registry.heroku.com``` (use the heroku auth token as password)

* push tagged image to heroku registry ```$ docker push registry.heroku.com/poinz/web```

* release new image ```$ heroku container:release web -a poinz``` (this will finally replace the currently running version on https://poinz.herokuapp.com)



A more suitable deployment might be needed in the future.

 
