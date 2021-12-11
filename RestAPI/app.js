require('rootpath')();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

require('./db');
const httpStatus = require('./lib/httpStatus')
const bodyParser = require('body-parser')

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.get('/api/v1', function (req, res) {
    res.status(httpStatus.OK).send('API v1 running');
});

const userController = require('controllers/userController');
app.use('/api/v1/users', userController);

const authController = require('controllers/authController');
app.use('/api/v1/authentication', authController);

const roomController = require('controllers/roomController');
app.use('/api/v1/rooms', roomController);

const meetingController = require('controllers/meetingController');
app.use('/api/v1/meeting', meetingController);

const meetingController2 = require('controllers/meetingController');
app.use('/api/v1/meetingByUser', meetingController2);

const logController = require('controllers/logController');
app.use('/api/v1/log', logController);

const userRoomController = require('controllers/userRoomController');
app.use('/api/v1/userRoom', userRoomController);

module.exports = app;
