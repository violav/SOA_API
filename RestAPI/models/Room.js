const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        maxlength: 100,
        minlength: 2,
        required: true,
        trim: true,
        type: String
    },
    capacity: {
        type: Number,
        mix: 4,
        max: 100
    },
    reference: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Room', userSchema);
