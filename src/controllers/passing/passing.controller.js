import moment from "moment"
import ApiResponse from "../../helpers/ApiResponse";
import Passing from "../../models/passing/passing.model"

export default {


    async getAll(req, res, next) {
        try {

            let { carId } = req.params,
                page = +req.query.page || 1, limit = +req.query.limit || 20

            let query = { deleted: false, car: carId };

            let passings = await Passing.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip((page - 1) * limit);

            const passingCount = await Passing.countDocuments(query);
            const pageCount = Math.ceil(passingCount / limit);

            res.send(new ApiResponse(passings, page, pageCount, limit, passingCount, req));

        } catch (error) {
            next(error)
        }
    },

    async passthThroughtGate(req, res, next) {
        try {
            let { carId } = req.params

            let car = await Cars.findOne({ _id: carId })

            if (!car)
                res.status(404).send('car not found')


            let lastPassing = await Passing.findOne({ car: carId }).sort({ createdAt: -1 });

            let differenceInMinute = lastPassing ? moment.duration(moment().diff(moment(lastPassing.createdAt))).asSeconds() : -1


            let cost = differenceInMinute > 0 && differenceInMinute <= 60 ? 4 : 0

            car.card = +car.card - cost

            await Promise.all([
                car.save(),
                Passing.create({
                    car: carId,
                    employee: car.employee,
                    cost: cost
                })
            ])

            res.send();
        } catch (err) {
            next(err);
        }
    },
}