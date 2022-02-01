
const mongoose = require('mongoose');

const rentalSchema = mongoose.Schema({
    costumer: {
        type: mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 5,
                maxLength: 50
            },
            isGold: {
                type: Boolean,
                required: true,
                default: false
            },
            phone: {
                type: Number,
                required: true,
                minLength: 10,
                maxLength: 20
            }
        }),
        required: true
    },
    movie: {
        type: mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                maxLength: 255,
                minLength: 3
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                trim: true,
                maxLength: 255,
                minLength: 0
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function(costumerId, movieId){
    return this.findOne({
        'costumer._id': costumerId,
        'movie._id': movieId
    });
}

const Rental = mongoose.model('rental', rentalSchema);

module.exports.Rental = Rental;