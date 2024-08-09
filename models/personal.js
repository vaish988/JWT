const mongoose = require('mongoose');
const Students=require('./student')
const personalSchema = new mongoose.Schema({
    address: {
        doorno: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    biodata: {
        name: { type: String, required: true },
        dob: { type: Date, required: true },
        gender: { type: String, required: true },
        native: { type: String, required: true }
    },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Students', required: true }
});

const Personal = mongoose.model('Personal', personalSchema);
module.exports = Personal;
