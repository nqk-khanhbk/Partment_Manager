# Department Manager Backend

## Introduction
The backend source code for the Bluemoon apartment fee management system.

API Design:

Frontend source: 

Detailed project report:

## Installation
### System Requirements
Frontend:

Node.js: ≥ 16.0.0

npm: ≥ 8.0.0

Backend:

JDK: ≥ 17

Maven: ≥ 3.6.0

If running via Docker container: Simply install Docker.

### Detailed Installation Steps
#### Option 1: Run Directly on the Machine*

Step 1: Run the Frontend

Execute the following commands:
```bash
cd frontend
npm install
npm start
```

Step 2: Run the Backend

Execute the following commands:
```bash
cd backend
mvn install
mvn spring-boot:run
```

Step 3: Run the Project

Open any web browser and navigate to localhost:3000 to run the program.

#### Option 2: Use Docker*

Create the image by using the repository link:


Step 1: Build the project code

Run the following command:
```bash
docker-compose up -d --build
```

Step 2: Run the project

Open any web browser and navigate to localhost:3000 to run the program.
