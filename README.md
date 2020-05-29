# Server Monitoring Project Overview
## Prerequisites
- docker and docker-compose
- prisma (sudo npm i -g prisma)

## Overview
The system is comprised of two systems: the frontend (localhost:3000) and the backend (localhost:4000). The backend, written in Node, stores data in a mysql database, using prisma to support GraphQL queries. The frontend is written in React.

# Installation/setup guide
## Deploy the containers
In the project directory, run: <br>
`docker-compose build` <br> 
`docker-compose up` <br> 
(If this project has been run before, ensure you run `docker-compose down` and `docker-compose build --no-cache` to recreate the prisma scheme)

## Create a user
go to [localhost:4000](http://localhost:4000) in your browser

run the GraphQL mutation below to create a user with admin privileges:
```
mutation user {
  register(email: "admin", password:"admin", isAdmin:true) {
    isAdmin
  }
}
```

## Upload configuration
First, go to [localhost:3000/login](http://localhost:3000/login) and enter email: `admin` and password: `admin`.

Then, go to [localhost:3000/upload](http://localhost:3000/upload) to upload the json below:
```
{
    "tasks":
        [
            {
                "number": 17,
                "command": "retrievelogs",
                "frequency": 1,
                "period": "weeks"
            },
            {
                "number": 23,
                "command": "retrievestats",
                "frequency": 1,
                "period": "days"
            },
            {
                "number": 35,
                "command": "refreshcache",
                "frequency": 1,
                "period": "months"
            },
            {
                "number": 49,
                "command": "obtainupdates",
                "frequency": 2,
                "period": "weeks"
            }
        ]
}
```

Finally, go to [localhost:3000/status](http://localhost:3000/status), and monitor the status of each task. This page relies on websockets to automatically get updates from the server, so you shouldn't need to refresh it. 

## Updating status of tasks
Task executions are saved in the `backend/ingress` directory. Add/rename the files in here and the server will check every 5 seconds for changes, updating the db and /status page. 

## Clearing the status (for debugging)
On the Prisma backend [localhost:4466](http://localhost:4466), enter the following query to remove all executions. 

```
mutation {
  deleteManyExecutions(where:{id_not: 0}) {
    count
  }
}
```
