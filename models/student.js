const mongoose = require('mongoose');
const Personal=require('./personal')
const Educational=require('./educational')
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    role: { type: String, required: true, enum: ['student', 'admin'] },
    personaldet: { type: mongoose.Schema.Types.ObjectId, ref: 'Personal' },
    educationaldet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Educational' }]
});

const Students = mongoose.model('Students', studentSchema);
module.exports = Students;
