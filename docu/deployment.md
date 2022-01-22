
# Deployment

PoinZ is currently deployed on a free-tier [heroku](https://www.heroku.com/) dyno. With mongodb as persistent storage on [MongoDB atlas](https://www.mongodb.com/cloud/atlas).



### Heroku deployment

* Build Docker image with ```$ npm run build```

* Retrieve heroku auth token : ```$ heroku auth:token```. (If you are not already logged in, you have to login first: ```$ heroku auth:login``` ).

* login to heroku's docker registry ```$ docker login -u=xeronimus@gmail.com registry.heroku.com``` (use the heroku auth token as password)

* push tagged image to heroku registry ```$ docker push registry.heroku.com/poinz/web```

* release new image ```$ heroku container:release web -a poinz``` (this will finally replace the currently running version on https://poinz.herokuapp.com)


A more suitable deployment might be needed in the future.

### MongoDB

in August 2020 we had to switch from mLab to mongoDB Atlas. (https://cloud.mongodb.com/).

Currently we use a free-tier (AWS / Ireland (eu-west-1), M0 Sandbox (General),  Replica Set - 3 node, no backups). 
See also https://docs.atlas.mongodb.com/reference/free-shared-limitations/ for limitations.

Environment variable "ATLAS_DB_URI" is set via heroku dashboard. It's read in settings.js and toggles persistent storage.
 
### Heroku log monitoring with Logz.io

```$  heroku drains:add "https://listener-nl.logz.io:8081?token=[TOKEN]" -a poinz```

If you want to manually analyze production logs on heroku, use the heroku cli on your dev machine:

```$ heroku logs -n 200 -a poinz --source app```

#### Logz.io grok parsing

We use this [grok](https://logz.io/blog/logstash-grok/) pattern to parse our loglines for Kibana.

```text
^%{TIMESTAMP_ISO8601:ts} %{LOGLEVEL:level}: \|POINZ\| \[%{WORD:component}\] (%{GREEDYDATA:action} user=%{NOTSPACE:userId} room=%{NOTSPACE:roomId})?%{GREEDYDATA:message}
```
