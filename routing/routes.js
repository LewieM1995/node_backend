import express from 'express';

// Import controllers
import addOrUpdatePantone from '../controllers/fuji/addOrUpdatePantone.js';
import {getUser} from'../controllers/fuji/fujiuser/getUser.js';
import getChart from '../controllers/fuji/getChart.js';
import postDataFuji from '../controllers/fuji/postData.js';
import getPantones from '../controllers/fuji/getPantones.js';
import postQuarantineInk from '../controllers/fuji/postQuarantineInk.js';
import updatePantone from '../controllers/fuji/updatePantone.js';
import deletePantone from '../controllers/fuji/deletePantone.js';
import postProcessData from '../controllers/fuji/postProcessData.js';
import getProcessQC from '../controllers/fuji/getProcessQC.js';

// Routes for fuji seal app
const fujiRouter = express.Router();

fujiRouter.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

fujiRouter.post('/getUser', getUser);
fujiRouter.post('/getChart', getChart);
fujiRouter.post('/postData', postDataFuji);
fujiRouter.get('/getPantones', getPantones);
fujiRouter.post('/addPantone', addOrUpdatePantone);
fujiRouter.post('/postQuarantineInk', postQuarantineInk);
fujiRouter.post('/updatePantone', updatePantone);
fujiRouter.delete('/deletePantone/:id', deletePantone);
fujiRouter.post('/postProcessData', postProcessData)
fujiRouter.post('/getProcessQCData', getProcessQC)

export default fujiRouter;
