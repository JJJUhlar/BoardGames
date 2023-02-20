# House of Games API

## Setup Instructions

### 1. Clone down the project
Use ```git clone``` to create a local copy of the project
### 3. Setup Environment Variables
You will need to add two ```.env``` files to configure and connect to your local test and development databases: ```.env.test``` and ```.env.development```. Add ```PGDATABASE=<your database name here>``` with the correct database for each file, as per ./db/setup.sql. Finally, make sure both files are included in your ```.gitignore```.
### 2. Install relevant packages
Use ```npm install``` to install packages
### 4. Setup databases
Use ```npm run setup-dbs``` and then ```npm run seed``` to seed the databases.
### 5. Enjoy