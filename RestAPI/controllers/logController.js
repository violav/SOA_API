const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Log = require('../models/Log');
const verifyToken = require('../lib/verifyToken');

router.post('/', verifyToken, function (req, res, next) {
    Log.create({
        idUser: req.body.idUser,
        dateTime: new Date(),
        message: req.body.message
    },
    function (err, Log) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(Log);
    });
});

//recupero i log di un utente , usato per mostrare a video l'ultima volta che si è loggato 
router.get('/:id', verifyToken, function (req, res, next) {
         Log.find({ idUser: req.params.id}, function (err, Logs) {
            if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
            res.status(httpStatus.OK).send(Logs);
        }).sort({ "dateTime": 'desc' }).limit(2).sort({ "dateTime": 'asc' }).limit(1);   
});


module.exports = router;
