import express from 'express';
import EmployeeController from '../../controllers/employee/employee.controller';
import carsRoute from '../cars/cars.route'


const router = express.Router();

router.use(carsRoute)

router.route('/:employeeId')
    .put(
        EmployeeController.validateBody(),
        EmployeeController.update
    )
    .delete(EmployeeController.delete)
    .get(EmployeeController.findById);

router.route('/')
    .post(
        EmployeeController.validateBody(),
        EmployeeController.create
    )
    .get(EmployeeController.getAll);

export default router;
