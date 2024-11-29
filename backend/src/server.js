require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJWT;
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const cron = require('node-cron');
const path = require('path');
const { botRoutes, userRoutes, adminRoutes } = require('./routes');
const { botService, userService, adminService } = require('./services');


const app = express();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR);


// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}


// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());
app.use('/uploads', express.static(uploadDir));


const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10),
    max: parseInt(process.env.RATE_LIMIT_MAX, 10),
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);


// Passport.js JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};


passport.use(new Strategy(jwtOptions, (jwtPayload, done) => {
    userService.findUserById(jwtPayload.id)
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
}));


app.use(passport.initialize());


// Routes
app.use('/bots', botRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        logger.info('Connected to MongoDB');
        //Start cron job for bot metric updates
        cron.schedule('/5    ', () => {
            botService.updateBotMetrics()
                .then(()=> logger.info('Bot metrics updated successfully'))
                .catch(error => logger.error('Error updating bot metrics:', error));
        });

    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        logger.error('Failed to connect to MongoDB:', err);
    });


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    logger.info(`Server listening on port ${port}`);
});

```