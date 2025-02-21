import express from 'express';
import cors from 'cors';
import http from 'http'; // change to https for prod
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {pool1} from "./database.js";
import fujiRouter from "./routing/routes.js";

dotenv.config();

// App
const app = express();
app.use(express.json());

const acceptedClients = process.env.ACCEPTED_CLIENTS
  ? process.env.ACCEPTED_CLIENTS.split(",")
  : [];


app.options("*", cors());
app.use(
  cors({
    origin: acceptedClients,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());


// db connection func to use mutliple pools
const dbConnection = (pool) => {
  return (req, res, next) => {
    pool.getConnection((error, connection) => {
      if (error) {
        console.error("Error connecting to db", error);
        return res.status(500).json({ error: "Database connection failed" });
      }
      req.dbConnection = connection;
      res.on("finish", () => {
        req.dbConnection.release();
      });
      next();
    });
  };
};

// Routes using pool1
app.use("/fujiseal", dbConnection(pool1), fujiRouter);

const server = http.createServer(/* options */ app);

//porting
const port = process.env.PORT || 4000;
//listener
server.listen(port, () => console.log(`Server is Live ${port}`));
console.log("Server started successfully");
