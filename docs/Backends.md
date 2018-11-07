---
id: backends
title: Backends
---

Microkubes platform supports multiple backends. So far it supports [MongoDB](https://www.mongodb.com/) and [DynamoDB](https://aws.amazon.com/dynamodb/). Both databases are nonrelational which are delivering reliable performance at any scale.

Microkubes has its own ```Golang Package``` for supporting multiple backends. There is not equivalent library in Python for this purpose. The package is easy to use and set up. The backend is determined by the configuration properties. When some microservice is using backends package it does not care about the backend it uses. It always calls same interface methods.

Backend is set up at start up of the services. It initialize the backend service base of the configuration provided. The package builds the backend service and returns it to the microservice for the later use.

Under the hood we are using [mgo](https://gopkg.in/mgo.v2) and [dynamo](https://github.com/guregu/dynamo) packages for MongoDB and DynamoDB database operations appropriately. The packages are still under development, so the API may change rarely. However, breaking changes will be avoided and the API can be considered relatively stable.

Creating of MongoDB database is done by using shell script which is run on platform start up. DynamoDB tables on the other hand are created using the official [AWS SDK](https://github.com/aws/aws-sdk-go) for the Go programming language.

Future plan is to add support for [PostgreSQL](https://www.postgresql.org/) and other databases.

# Set Up Backends service

As mentioned above the package read the DB configuration and base on that creates the backend service.

In the ```main.go```:

Define the supported backends:

```go
  backendManager := backends.NewBackendSupport(map[string]*config.DBInfo{
    "mongodb":  &dbConf.DBInfo,
    "dynamodb": &dbConf.DBInfo,
  })

```

Get the desire backend(mongoDB or dynamoDB):

```go
  backend, err := backendManager.GetBackend(dbConf.DBName)
  if err != nil {
    service.LogError("Failed to configure backend. ", err)
  }
```

Define the repositories(collections/tables):

```go
  serviceRepo, err := backend.DefineRepository("repository-name", backends.RepositoryDefinitionMap{
    "name":          "collection/table-name",
    "indexes":       []string{"email"},
    "hashKey":       "email",
    "readCapacity":  int64(5),
    "writeCapacity": int64(5),
    "GSI": map[string]interface{}{
      "email": map[string]interface{}{
        "readCapacity":  1,
        "writeCapacity": 1,
      },
    },
  })
  if err != nil {
    service.LogError("Failed to get repo.", err)
    return
  }

```

* **name** - is the name of the collection/table
* **indexes** - are the mongoDB indexs
* **hashKey** - is the primary key (hash key) for dynamoDB table
* **rangeKey** - is the sort key (range key) for dynamoDB table
* **readCapacity** - is the read capacity of the table. 1 unit is eqaul to 4KB
* **writeCapacity** - is the write capacity of the table. 1 unit is eqaul to 4KB
* **GSI** - are the global secondary indexes for dynamoDB
* **enableTtl** - set TTL
* **ttlAttribute** - is the TTL attribute in the collection/table
* **ttl** - is the TTL value in seconds

## Service DB configuration

The service loads the configuration from a JSON file. Here's an example of a JSON configuration file for DB settings:

```json
{
    ...
    "database":{
        "dbName": "dynamodb",
        "dbInfo": {
        "credentials": "/run/secrets/aws-credentials",
        "endpoint": "http://dynamo:8000",
        "awsRegion": "us-east-1",
        "host": "mongo:27017",
        "database": "database-name",
        "user": "username",
        "pass": "password"
        }
    }
}
```

Configuration properties:
 * **dbName** - ```"dynamodb/mongodb"``` - is the name of the database( it can be mongodb/dynamodb ).
 * **dbInfo** - holds informations about each database.
 * **credentials** - ```"/run/secrets/aws-credentials"``` - is the full the to the AWS credentials file.
 * **endpoint** - ```"http://dynamo:8000"``` - is the dynamoDB endpoint. Format http://host:port
 * **awsRegion** - ```us-east-1``` - is the AWS region.
 * **host** - ```mongo:27017``` - mongoDB endpoint. Format host:port.
 * **database** - ```db-name``` - database name. Use only for mongoDB.
 * **user** - mongo database user
 * **pass** - mongo database password