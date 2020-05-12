## Deploy the containers
In the project directory, run: <br>
`docker-compose build` <br> 
`docker-compose up`

then inside the backend directory, run: <br>
`prisma-deploy`


## create a user
go to [localhost:4000]() in your browser

run mutation:
```
mutation user {
  register(email: "admin", password:"admin", isAdmin:true) {
    isAdmin
  }
}
```

## upload configuration
First, go to [localhost:3000/login]() and enter email: `admin` and password `admin`.

Then, go to [localhost:3000/upload]() to upload the json below:
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

Finally, go to [localhost:3000/status](), and monitor the status of each task. This page relies on websockets to automatically get updates from the server, so you shouldn't need to refresh it. 

## Updating status of tasks
First, run `docker exec -it backend /bin/bash`. The `ingress` directory is for the task-run files. Add/rename the files in here and the server will check every 5 seconds for changes, updating the db.