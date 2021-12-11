const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const User = require('../models/User');
const verifyToken = require('../lib/verifyToken');
const bcrypt = require('bcryptjs');

router.post('/', function (req, res) {
  User.create({
      name : req.body.name,
      email : req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    },
    function (err, user) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
            res.status(httpStatus.OK).send(user);
    });
});

router.get('/', verifyToken, function (req, res, next) {
        User.find({}, function (err, users) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(users);
    }).select('-password -__v').sort({ name: 1 });  
});

router.get('/:id', verifyToken, function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    if (!user) return res.status(httpStatus.NOT_FOUND).send('User not found');
    res.status(httpStatus.OK).send(user);
  }).select('-password -__v');
});

router.delete('/:id', verifyToken, function (req, res, next) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.OK).send("User: "+ user.name +" was deleted.");
  });
});

router.put('/:id', verifyToken, function (req, res, next) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.findByIdAndUpdate(req.params.id, {
        $set: { email: req.body.email, name: req.body.name, password: hashedPassword }}, {new:false}, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.NO_CONTENT).send(user);
  });
});


module.exports = router;
