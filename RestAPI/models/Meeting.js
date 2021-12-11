const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const userSchema = new Schema({
    room: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    dateFrom: {
        type: Date 
    },
    dateTo: {
       type: Date 
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Meeting', userSchema);
