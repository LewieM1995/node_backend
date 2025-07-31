import express from "express";

// Import controllers
import addOrUpdatePantone from "../controllers/fuji/addOrUpdatePantone.js";
import { getUser } from "../controllers/fuji/fujiuser/getUser.js";
import getChart from "../controllers/fuji/getChart.js";
import postDataFuji from "../controllers/fuji/postData.js";
import getPantones from "../controllers/fuji/getPantones.js";
import postQuarantineInk from "../controllers/fuji/postQuarantineInk.js";
import updatePantone from "../controllers/fuji/updatePantone.js";
import deletePantone from "../controllers/fuji/deletePantone.js";
import postProcessData from "../controllers/fuji/postProcessData.js";
import getProcessQC from "../controllers/fuji/getProcessQC.js";

/*
import initTicketRoute from '../controllers/fuji/ticket_system/initTicketRoute.js';
import getTicketById from '../controllers/fuji/ticket_system/getTicketById.js';
import postCommentById from '../controllers/fuji/ticket_system/postCommentById.js';
import getTickets from '../controllers/fuji/ticket_system/getTickets.js';
import closeTicketById from '../controllers/fuji/ticket_system/closeTicketById.js';
import getClosedTickets from '../controllers/fuji/ticket_system/getClosedTickets.js';
import { getUserForTicketSystem } from '../controllers/fuji/ticket_system/getUser.js';
*/

// Routes for fuji seal app
const fujiRouter = express.Router();

fujiRouter.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

fujiRouter.post("/getUser", getUser);
fujiRouter.post("/getChart", getChart);
fujiRouter.post("/postData", postDataFuji);
fujiRouter.get("/getPantones", getPantones);
fujiRouter.post("/addPantone", addOrUpdatePantone);
fujiRouter.post("/postQuarantineInk", postQuarantineInk);
fujiRouter.post("/updatePantone", updatePantone);
fujiRouter.delete("/deletePantone/:id", deletePantone);
fujiRouter.post("/postProcessData", postProcessData);
fujiRouter.post("/getProcessQCData", getProcessQC);

/*
fujiRouter.post('/initTicketRoute', initTicketRoute);
fujiRouter.get('/ticket/:id', getTicketById );
fujiRouter.post('/ticket/:id/post_comment', postCommentById);
fujiRouter.get('/get_tickets', getTickets);
fujiRouter.put('/ticket/:id/close_ticket', closeTicketById);
fujiRouter.get('/get_closed_tickets', getClosedTickets);
fujiRouter.post('/getUserForTicketSystem', getUserForTicketSystem);
*/

const cameraRouter = express.Router();

cameraRouter.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

export default fujiRouter;
