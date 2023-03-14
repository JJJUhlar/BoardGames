# House of Board Games API

## Introduction

This is 'House of Board Games,' a board-games review website. 
You can view the project here: https://houseofboardgames.onrender.com/api/reviews
There are many endpoints which allow you to view reviews, users, comments and vote. 
You can see a summary of the endpoint functionalities by going to the [/api](https://houseofboardgames.onrender.com/api/) endpoint.



## Setup Instructions

### 0. Requirements
- Node >6.0.0
- Postgres >8.7.3

### 1. Clone down the project
Use ```git clone``` to create a local copy of the project
### 3. Setup Environment Variables
You will need to add two ```.env``` files to configure and connect to your local test and development databases: ```.env.test``` and ```.env.development```. Add ```PGDATABASE=<your database name here>``` with the correct database for each file, as per ```./db/setup.sql```. Finally, make sure both files are included in your ```.gitignore```.
### 2. Install relevant packages
Use ```npm install``` to install packages
### 4. Setup databases
Use ```npm run setup-dbs``` and then ```npm run seed``` to seed the local databases.
### 5. Enjoy
