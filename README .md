# Next.js TeslaShop App

## Run application
For run the application localy, you need correr the db
```
docker-compose up -d
```

* The -d means __detached__

MongoDB URL Local:
```
mongodb://localhost:37027/teslodb
```


## Config env variables
Rename __.env.template__ file to __.env__



## Entry test data to db

```
http://localhost:3000/api/seed
```