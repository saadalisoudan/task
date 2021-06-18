import express from 'express';
import CarsController from '../../controllers/cars/cars.controller';
import PassingController from '../../controllers/passing/passing.controller';

const router = express.Router();

router.route('/:employeeId/cars/:carId')
    .put(
        CarsController.validateBody(),
        CarsController.update
    )
    .get(CarsController.findById)
    .delete(CarsController.delete)

router.route('/:employeeId/cars')
    .post(
        CarsController.validateBody(),
        CarsController.create
    )

router.route('/:carId')
    .post(PassingController.passthThroughtGate)
    .get(PassingController.getAll);

router.route('/')
    .get(CarsController.getAll);

export default router;
