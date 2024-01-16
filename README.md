# React Project Name
DemoStore-Frontend-React version 1.1.0

- bugs resolved: raw data are not reloaded after creating new object for the table.

## Project Introduction

This is the frontend part of a full-stack demo store project developed using React framework, with the following features and functionalities:

- CRUD functions of Customer, Product, Store and Sales tables.
- using Semantic-UI-React modals to control the style of views.
- using axios to post to/get/put/delete data from the controllers.
- sorting and pagination of each table view.

## Online Demonstration
check on the following link for online demonstration of the frontend part of the project: 
https://demostore-frontend.azurewebsites.net/

## Installation and Usage Instructions
to run the project on-premise, git clone the frontend project, and 
```bash
cd {project folder name}
npm install
npm run dev
```

To change the api from azure to on-premise, remember to change the BASE_URL in "hooks/useRequest.js" to:
BASE_URL = {your backend api and port};

### Environment Dependencies

- Node.js 16.20.2
- npm 8.19.4
- vite 5.0.0
- react 18.2.0
- semantic-ui-react 2.1.5

