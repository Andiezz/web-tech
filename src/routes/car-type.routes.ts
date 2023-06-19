import express from 'express';
import { carTypeList } from '../controllers/car-type.controllers';

const router = express.Router();

router.get('/car_type', carTypeList);

export default router;
