import ApiResponse from "../../helpers/ApiResponse";
import { body } from "express-validator/check";
import { checkValidations } from "../../services/herlper.service";
import Employee from "../../models/employee/employee.model";
import { escapeRegExp} from "lodash";

export default {
    async getAll(req, res, next) {
        try {
            let page = +req.query.page || 1, limit = +req.query.limit || 20,
                { name, age, position } = req.query;

            let query = { deleted: false };

            if (age) query.age = age
            if (position) query.position = new RegExp(escapeRegExp(position), 'i')
            if (name) query.name = new RegExp(escapeRegExp(name), 'i')


            let employees = await Employee.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip((page - 1) * limit);


            const employeesCount = await Employee.countDocuments(query);
            const pageCount = Math.ceil(employeesCount / limit);

            res.send(new ApiResponse(employees, page, pageCount, limit, employeesCount, req));

        } catch (error) {
            next(error)
        }
    },

    validateBody() {

        let validations = [
            body('name').not().isEmpty().withMessage('name is required'),
            body('age').not().isEmpty().withMessage('age is required')
                .isNumeric().withMessage('age must be number'),
            body('position').not().isEmpty().withMessage('position is required')
        ];

        return validations;
    },

    async create(req, res, next) {
        try {
            const validatedBody = checkValidations(req, res);

            let createdEmployee = await Employee.create(validatedBody);

            res.status(201).send(createdEmployee);
        } catch (err) {
            next(err);
        }
    },

    async update(req, res, next) {
        try {
            let { employeeId } = req.params

            const validatedBody = checkValidations(req, res);

            let employee = await Employee.findById(employeeId)

            if (!employee)
                res.status(404).send('employee not found')

            let updatedEmployee = await Employee.findByIdAndUpdate(employeeId, validatedBody, { new: true });

            res.send(updatedEmployee);
        } catch (err) {
            next(err);
        }
    },

    async findById(req, res, next) {
        try {
            let { employeeId } = req.params

            let employee = await Employee.findById(employeeId)

            if (!employee)
                res.status(404).send('employee not found')

            res.send(employee);
        } catch (err) {
            next(err);
        }
    },

    async delete(req, res, next) {
        try {
            let { employeeId } = req.params

            let employee = await Employee.findById(employeeId)

            if (!employee)
                res.status(404).send('employee not found')

            employee.deleted = true;
            await employee.save();

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

};