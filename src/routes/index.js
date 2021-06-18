import express from 'express';
import employeeRoute from './employee/empoyee.route'
import carsRoute from './cars/cars.route'

const router = express.Router();

router.use('/employees', employeeRoute);
router.use('/cars', carsRoute);



export default router;
