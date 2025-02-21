# kpi_app backend server

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/LewieM1995/node_backend.git

# Navigate into the project folder
cd node_backend

# Install dependencies
npm install

# Run the development server
node index.js

# Database .env needed:
DB_HOST_3= # database host name
DB_USER_3= # database username
DB_PASSWORD_3= # database password
DB_NAME_3= # database name
DB_PORT_3= # database port

ACCEPTED_CLIENTS= # comma separated list of accepted clients

# Project structure
/node_server
│── /index     # main app file, creates server
│── .env       # Environment variables
│── README.md  
│── routes      # manages routes / endpoints
│── controllers
    ├── dataProcessing     # (folder) data manipulation for graphs etc + list of pantones
    ├── fujiuser  # (folder) very simple auth
    ├── ...endpoint files
    
```

# Dependancies
    bcrypt: ^5.1.1,
    body-parser: ^1.20.2,
    cors: ^2.8.5,
    dotenv: ^16.0.3,
    express: ^4.18.2,
    mathjs: ^11.11.1,
    mongoose: ^7.0.1,
    morgan: ^1.10.0,
    mysql2: ^3.6.5,

# Built With
+ MySQL - Database
+ AWS Hosting - RDS and EC2
+ Nodejs - Backend / RESTful api


# Contact
GitHub: [@LewieM1995](https://github.com/LewieM1995)
LinkedIn: [Lewie Marks](https://www.linkedin.com/in/lewie-marks-b84504124/)