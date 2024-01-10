[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/PDAJtvbl)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=12403569&assignment_repo_type=AssignmentRepo)

![](http://143.42.108.232/pvt/Noroff-64.png)
# Noroff
## Back-end Development Year 1
### REST API - Course Assignment 1 <sup>V2</sup>

Startup code for Noroff back-end development 1 - REST API course.

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://143.42.108.232/pvt/important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://143.42.108.232/pvt/help_small.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---

# Application Installation and Usage Instructions
This appications purpose is to give you more control of your everyday life. You can make an account and create your personal categories and todos inside these categories. You can change statuses of you todos, update your categories and todos and also change their statuses.
### Installation:
1. Clone the repository and open the aplication in your open-source code editor.
2. Open terminal and use command "npm install".
3. Create an .env file to fit your database.
4. Start application with command "npm start" and wait 5 seconds to know that the database is correctly populated.
5. To run the test file use the command "npm test".

# Environment Variables
- ADMIN_USERNAME = "YOUR_USERNAME"
- ADMIN_PASSWORD = "YOUR_PASSWORD"
- DATABASE_NAME = "YOUR_DATABASE"
- DIALECT = "mysql"
- PORT = "YOUR_PORT"
- HOST = "YOUR_HOST"
- TOKEN_SECRET=TOUR_TOKEN_SECRET

# Additional Libraries/Packages
### Packages used:
  - "cookie-parser": "~1.4.4",
	- "debug": "~2.6.9",
	- "dotenv": "^16.0.3",
	- "ejs": "^3.1.8",
	- "express": "^4.18.2",
	- "http-errors": "~1.6.3",
	- "jest": "^29.7.0",
	- "jsend": "^1.1.0",
	- "jsonwebtoken": "^9.0.2",
	- "morgan": "~1.9.1",
	- "mysql": "^2.18.1",
	- "mysql2": "^3.1.2",
	- "sequelize": "^6.29.0",
	- "supertest": "^6.3.3",
	- "swagger-autogen": "^2.23.6",
	- "swagger-ui-express": "^5.0.0"

# NodeJS Version Used
- v18.16.0

# SWAGGER Documentation link
Use this link only after app is started.
- http://localhost:3000/doc/





