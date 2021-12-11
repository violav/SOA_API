const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const UserRoom = require('../models/UserRoom');

const verifyToken = require('../lib/verifyToken');

router.post('/', verifyToken,  function (req, res) {
    UserRoom.create({
        room: req.body.room,
        user: req.body.user
    },
        function (err, user) {
            if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
                res.status(httpStatus.OK).send(user);
          });
});


router.get('/:id', verifyToken, function (req, res, next) {
    UserRoom.find({ user: req.params.id } , function (err, user) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(user);
    });
});


router.get('/', verifyToken, function (req, res, next) {

    UserRoom.find({}, function (err, users) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(users);
    });

}); 


module.exports = router;
