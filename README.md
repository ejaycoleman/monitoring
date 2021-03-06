# Server Monitoring Project Overview
## Prerequisites
- docker, docker-compose and npm

## Overview
The system is comprised of two systems: the frontend (localhost:3000) and the backend (localhost:4000). The backend, written in Node, stores data in a mysql database, using prisma to support GraphQL queries. The frontend is written in React.

# Installation/setup guide
## Deploy the containers
1. If this project has been run before (and there are schema changes), run the following commands within the project directory: (otherwise continue to step 2)<br>
`npm run stop` <br> 
`npm run clean` (this will clear the database)

2. Run: <br>
`npm run build` <br> 
`npm start` 

3. After running the first time, you should see errors like this:  
![Prior Migrate](prior_migrate.png) <br>
This is because the schema has not been replicated in the database. To fix this, run: <br>
`npm run migrate` in the project directory while the containers are running<br>

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
Task executions are saved in the `backend/ingress` directory. Add/rename the files in here and the server will check every 5 seconds for changes, updating the db and /status page. <br>

To view the raw data stored in the database, you can visit [localhost:5555](http://localhost:5555) <br>


# Documentation
## Frontend File Structure (/frontend/src)
The overall strucuture consists of components within the src directory, along with other helpers/functionality. If a component interacts with the GraphQL backend, it will consist of a ComponentContainer.js and a Component file, link together with an index.js file. The component container places either the query result or the mutation trigger in the props of the component, where it can be called as either props.query or props.mutation().
Redux is used so all the child components have access to data in an overarching state (known at the store). Task data (including executions) and user data (including preferences) are stored here, and it allows changes to be reflected across all pages when it changes it once place.

/actions - used for redux, describes paramaters for reducers  
/gql - the various GraphQL queries and mutations for interacting with the backend  
/InteractiveModal - Used for things such as preference panes  
/Login - renders the Login page. Contains three files: index, Login and LoginContainer. LoginContainer enabled GraphQL data - providing data as a prop in Login. Login contains the remaining code  
/Menu - the component for the dropdown menu in the navigation  
/Notification - the component for showing notifications in the top right (for examples alerts when something didn't work)  
/reducers - the logic for changing the global store (implemented by Redux). Three stores (authorisation, preferences and tasks) are combined into one store using index  
/Status - the code for the Status (Home) page.  
/Status/ExecutionTable - the code for each table displaying executions (expanded in the task table)  
/Status/PreferencesModal - the preferences component (displayed when changing the chip for last received executions)  
/Status/StatusRow - the component to display the task within the table  
/Status/TaskSettingsModal - the component to display the preferences modal when editing a task  
/Status/Visualisations - the component for displaying the graph at the bottom of the Status component  
/Upload - The page for uploading new tasks  
/User - The page whenere users can change their preferences (For types of notification they receive)  
/Navigation.js - An overarching component, displaying the navigation at the top and page at the bottom, providing from authentication logic  
/index.js - Initialises connections (socket and https) with the backend  

## Backend File Structure (/backend)
The overall structure consists of the main server.js file, which initialises the backend to use prisma and also implements other functionality (such as cron jobs). The resolvers directory contains all the various resolvers for how data can be queried and mutated. 

/src/server.js - Initialises the backend, providing a prisma endpoint and configures the cronjobs (such as reading executions)  
/src/schema.graphql - The schema used by the backend (providing various queries, mutations and entities to be used at localhost:4000)  
/src/context.js - Used for authentication  
/src/resolvers - Contains the logic for each type of commmand on the backend. Mutation.js and Query.js provide mutation and query logic retrospectively, while the rest provide logic as to how entities are related (allowing nested queries)  
/prisma/schema.prisma - The schema for the database. Prisma will generate a database in accordance to this schema  
/ingress - directory where executions are written  
/archive - directory for storing recorded executions  

# TODO
1) Prevent users from submitting values lower than 1.
2) The reject button should be next to the approve button on the table of tass
3) Users could get notified when one of their requested tasks has been rejected
4) Confirm email logic is working
5) Enabling and disabling of notifications doesn't seem to be stored consistently.
6) Over time, the graph will get quite dense. It may be worth a drop-down where you can choose to view the last week, month, 3 months, 6 months, 12 months, 24 months, or perhaps allow the specification of a start and end date to display. You will want to change the values on the y-axis so that the lowest value being displayed is shown at the bottom of the graph.
