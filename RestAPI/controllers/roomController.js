const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Room = require('../models/Room');
const verifyToken = require('../lib/verifyToken');

router.post('/', function (req, res) {
    const { reference, capacity, name } = req.body
    if (!reference || !capacity || !name ) {
        return res.status(httpStatus.BAD_REQUEST).send({ registered: false, error: 'Invalid parameters in request' });
    }
    Room.create({
        name: req.body.name,
        capacity: req.body.capacity,
        reference: req.body.reference
    },
        function (err, user) {
            if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
            res.status(httpStatus.OK).send(user);
        });
});

router.get('/', verifyToken, function (req, res, next) {

    Room.find({}, function (err, room) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(room);
    }).populate('reference' , 'name email').sort({ name: 1 });
});

router.get('/:id', verifyToken, function (req, res, next) {
    Room.findById(req.params.id, function (err, user) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        if (!user) return res.status(httpStatus.NOT_FOUND).send('User not found');
        res.status(httpStatus.OK).send(user);
    }).populate('reference', 'name email');
});

router.delete('/:id', verifyToken, function (req, res, next) {
    Room.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send("User: " + user.name + " was deleted.");
    });
});

router.put('/:id', verifyToken, function (req, res, next) {
    Room.findByIdAndUpdate(req.params.id, {
        $set: { name: req.body.name, capacity: req.body.capacity, reference: req.body.reference }
    }, { new: false }, function (err, user) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.NO_CONTENT).send(user);
    });
});


module.exports = router;
