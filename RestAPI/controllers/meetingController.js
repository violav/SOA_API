const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Meeting = require('../models/Meeting');
const Utils = require('../lib/Utils');

const verifyToken = require('../lib/verifyToken');
const bodyParser = require('body-parser');


router.post('/', verifyToken, function (req, res, next) {
    const { user, room, dateFrom, dateTo } = req.body
    if (!user || !room || !dateFrom || !dateTo) {
        return res.status(httpStatus.BAD_REQUEST).send({ registered: false, error: 'Invalid parameters in request' });
    }
    var count = 0;
    var capacity = 0;
    //controllo che l'aula non si già piena
    Utils.boolIsRoomAllowed( req.body.user, req.body.room, function (resAllowed) {

        if (resAllowed) {
            Utils.boolIsBusy(req.body.room, function (resStat) {
                console.log('qui');
                if (!resStat) {
                    Meeting.create({
                        user: req.body.user,
                        room: req.body.room,
                        dateFrom: req.body.dateFrom,
                        dateTo: req.body.dateTo
                    },
                        function (err, meeting) {
                            if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
                            res.status(httpStatus.OK).send(meeting);
                        });
                }
                else {
                    return res.status(httpStatus.NOT_ACCEPTABLE).send(`no places available `);
                }
            });

        } else {
            return res.status(httpStatus.NOT_ACCEPTABLE).send(`room not allowed`);
        };
    });

});




router.get('/', verifyToken, function (req, res, next) {

    Meeting.find({}, function (err, meeting) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(meeting);
    }).populate({
        path: 'room',
        model: 'Room',
        populate: {
            path: 'reference',
            model: 'User'
        }
    }).populate('user', 'name email');

});

router.get('/:id', verifyToken, function (req, res, next) {

    if (req.baseUrl === "/api/v1/meetingByUser") {

        Meeting.find({ user: req.params.id }, function (err, meeting) {
            if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
            if (!meeting) return res.status(httpStatus.NOT_FOUND).send('User not found');
            res.status(httpStatus.OK).send(meeting);
        }).populate({
            path: 'room',
            model: 'Room',
            populate: {
                path: 'reference',
                model: 'User'
            }
        }).populate('user', 'name email');
    }
    else {
        Meeting.findById(req.params.id, function (err, meeting) {
            if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
            if (!meeting) return res.status(httpStatus.NOT_FOUND).send('User not found');
            res.status(httpStatus.OK).send(meeting);
        }).populate({
            path: 'room',
            model: 'Room',
            populate: {
                path: 'reference',
                model: 'User'
            }
        }).populate('user', 'name email');
    }
});


router.delete('/:id', verifyToken, function (req, res, next) {
    Meeting.findByIdAndRemove(req.params.id, function (err, meeting) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send("User: " + req.params.id + " was deleted.");
    });
});

router.put('/:id', verifyToken, function (req, res, next) {
    Meeting.findByIdAndUpdate(req.params.id, {
        $set: { email: req.body.email, name: req.body.name }
    }, { new: false }, function (err, meeting) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
            res.status(httpStatus.NO_CONTENT).send(meeting);
    });
});


module.exports = router;



//const UserRoom = require('../models/UserRoom');
//const Room = require('../models/Room');

// la foreign key non si carica. Questo sarebbe il modo corretto ma non va
/*function boolIsBusy( idRoom, callback)
{
    var count = 0;
    var capacity = 0;
    //controllo che l'aula non si già piena
    Meeting.find({ room: idRoom }).exec(function (err, results) {
        count = results.length;
        if (count > 0) {
    
            var t = results[0].room.capacity;

            capacity = results[0].room.capacity;
            if (count < capacity)
                callback(false);
            else
                callback(true);
        }
        else
        {
            callback(false);
        }
    });
} */



/*function boolIsBusy(idRoom, callback) {
    var count = 0;
    var capacity = 0;
  

    //controllo che l'aula non si già piena
    Meeting.find({ room: idRoom }).exec(function (err, results) {
        count = results.length;
        if (count > 0) {

            Room.findById(results[0].room).exec(function (err, re) {
                capacity = re.capacity;
                if (count < capacity)
                    callback(false);
                else
                    callback(true);
            });

          
        }
        else {
            callback(false);
        }
    });
}


function boolIsRoomAllowed(idUser, idRoom, callback) {
    var count = 0;
    var capacity = 0;
    //controllo che l'aula non si già piena
    UserRoom.find({ room: idRoom, user: idUser }).exec(function (err, results) {
        count = results.length;
        if (count > 0) {
            callback(true);
        }
        else {
            callback(false);
        }
    });
}
 */