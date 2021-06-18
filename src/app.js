import express from 'express';
import http from 'http';
import path from 'path';
import bodyparser from 'body-parser';
import cors from 'cors';
import expressValidator from 'express-validator';
import helmet from 'helmet';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import url from 'url';

import config from './config';

import router from './routes';


mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl);

autoIncrement.initialize(mongoose.connection);

mongoose.connection.on('connected', () => console.log('\x1b[32m%s\x1b[0m', '[DB] Connected...'));
mongoose.connection.on('error', err => console.log('\x1b[31m%s\x1b[0m', '[DB] Error : ' + err));
mongoose.connection.on('disconnected', () => console.log('\x1b[31m%s\x1b[0m', '[DB] Disconnected...'));

const app = express();

app.use(cors());
app.use(helmet());

// Ensure Content Type
app.use('/', (req, res, next) => {

    // check content type
    let contype = req.headers['content-type'];
    if (contype && !((contype.includes('application/json') || contype.includes('multipart/form-data'))))
        return res.status(415).send({ error: 'Unsupported Media Type (' + contype + ')' });


    // set current host url
    config.appUrl = url.format({
        protocol: req.protocol,
        host: req.get('host')
    });

    next();
});



app.use(bodyparser.json({ limit: '100mb' }));
app.use(bodyparser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));


app.use(expressValidator());

//Routes
app.use('/api/v1', router);



//Not Found Handler
app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found...'));
});


//ERROR Handler
app.use((err, req, res, next) => {
    if (err instanceof mongoose.CastError)
        err = { status: 400, message: err.model.modelName };

    res.status(err.status || 500).json({
        errors: err.message
    });

    console.log(err);
    //console.log(JSON.stringify(err));
});


export default app;


