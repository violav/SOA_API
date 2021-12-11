const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;
//const moment = require('moment-timezone');
//const dateThailand = moment.tz(Date.now(), "Europre/Vatican");

const logsSchema = new Schema({
    idUser: {
        required: true,
        type: String
    },
    dateTime: {
        required: true,
        type: Date
    },
    message: {
        type: String
    }
});


logsSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Log', logsSchema);
