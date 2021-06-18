import ApiResponse from "../../helpers/ApiResponse";
import { body } from "express-validator/check";
import { checkValidations } from "../../services/herlper.service";
import Employee from "../../models/employee/employee.model";
import { escapeRegExp } from "lodash";
import Cars from "../../models/cars/cars.model";

export default {

    async getAll(req, res, next) {
        try {
            let page = +req.query.page || 1, limit = +req.query.limit || 20,
                { brand, model, plateNumber } = req.query;

            let query = { deleted: false };

            if (plateNumber) query.plateNumber = new RegExp(escapeRegExp(plateNumber), 'i')
            if (model) query.model = new RegExp(escapeRegExp(model), 'i')
            if (brand) query.brand = new RegExp(escapeRegExp(brand), 'i')


            let cars = await Cars.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip((page - 1) * limit);

            const carsCount = await Cars.countDocuments(query);
            const pageCount = Math.ceil(carsCount / limit);

            res.send(new ApiResponse(cars, page, pageCount, limit, carsCount, req));

        } catch (error) {
            next(error)
        }
    },

    validateBody() {

        let validations = [
            body('brand').not().isEmpty().withMessage('brand is required'),
            body('model').not().isEmpty().withMessage('model is required'),
            body('plateNumber').not().isEmpty().withMessage('plateNumber is required')
        ];

        return validations;
    },

    async create(req, res, next) {
        try {
            let { employeeId } = req.params;

            const validatedBody = checkValidations(req, res);

            validatedBody.employee = employeeId
            validatedBody.cost = 10

            let createdCars = await Cars.create(validatedBody);

            res.status(201).send(createdCars);
        } catch (err) {
            next(err);
        }
    },

    async update(req, res, next) {
        try {
            let { employeeId, carId } = req.params

            const validatedBody = checkValidations(req, res);

            let car = await Cars.findOne({ _id: carId, employee: employeeId })

            if (!car)
                res.status(404).send('car not found')

            let updatedCar = await Cars.findByIdAndUpdate(carId, validatedBody, { new: true });

            res.send(updatedCar);
        } catch (err) {
            next(err);
        }
    },

    async findById(req, res, next) {
        try {
            let { employeeId, carId } = req.params

            let car = await Cars.findOne({ _id: carId, employee: employeeId })

            if (!car)
                res.status(404).send('car not found')

            res.send(car);
        } catch (err) {
            next(err);
        }
    },

    async delete(req, res, next) {
        try {
            let { employeeId, carId } = req.params

            let car = await Cars.findOne({ _id: carId, employee: employeeId })

            if (!car)
                res.status(404).send('car not found')

            car.deleted = true;
            await car.save();

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

};