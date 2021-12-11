const express = require('express');
const httpStatus = require('lib/httpStatus');
const Meeting = require('../models/Meeting');
const UserRoom = require('../models/UserRoom');
const Room = require('../models/Room');


module.exports = {

      RoomCapacity: (req, res, callback) =>  {
         Room.findById(results[0].room).exec(function (err, re) {
             capacity = re.capacity;
             if (count < capacity)
                 callback(false);
             else
                 callback(true);
         }
     )},



 boolIsBusy : (idRoom, callback) => {
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
},

    
     boolIsRoomAllowed: (idUser, idRoom, callback) =>  {
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

}



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


