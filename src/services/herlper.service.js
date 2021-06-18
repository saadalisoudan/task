import { validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";

export function checkValidations(req, res) {

    const validationErrors = validationResult(req).array({ onlyFirstError: true });

    if (validationErrors.length > 0) {
        return res.status(422).send(validationErrors);
    }

    return matchedData(req);
}