# Server Monitoring Project Overview
## Prerequisites
- docker and docker-compose

## Overview
The system is comprised of two systems: the frontend (localhost:3000) and the backend (localhost:4000). The backend, written in Node, stores data in a mysql database, using prisma to support GraphQL queries. The frontend is written in React.

# Installation/setup guide
## Deploy the containers
In the project directory, run: <br>
`docker-compose build` <br> 
`docker-compose up` <br> 
(If this project has been run before, ensure you run `docker-compose down` and `docker-compose build --no-cache` to recreate the prisma scheme) You may also need to prune the old containers due to the prisma v1->v2 upgrade. <br>

If you continue to get errors, you may need to clear the mysql databse: `docker exec -it mysql bash`, followed by `mysql -u root -p` then enter the root password (it should be prisma). Finally, run `DROP DATABASE prisma`. After this, re-build and run the containers. 

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

Then, go to [localhost:3000/upload](http://localhost:3000/upload) and upload [tasks.json](./tasks.json)

Finally, go to [localhost:3000](http://localhost:3000), and monitor the status of each task. This page relies on websockets to automatically get updates from the server, so you shouldn't need to refresh it. 

## Updating status of tasks
Task executions are saved in the `backend/ingress` directory. Add/rename the files in here and the server will check every 5 seconds for changes, updating the db and /status page. 

<br>

To view the raw data stored in the database, you can visit [localhost:5555](http://localhost:5555)

<br>

After an execution has been recorded, it stays in the ingress directory to make debugging easier. The moveFiles constant in /backend/src/server.js, line 19, can be set to true to make the files move to the archive directory once they have been recorded.