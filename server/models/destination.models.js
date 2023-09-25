import mongoose, { mongo } from 'mongoose';

const destinationSchema = new mongoose.Schema({
    destinations: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

module.exports = mongoose?.models?.destination || mongoose.model("destination", destinationSchema)