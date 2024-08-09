const mongoose = require('mongoose')

const educationalSchema = new mongoose.Schema({
    current: { type: String, required: true },
    education: {
        level: { type: String, required: true },
        institute: {
            name: { type: String, required: true },
            location: { type: String, required: true }
        }
    },
    marks: { type: Number, required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Students', required: true }
});

const Educational = mongoose.model('Educational', educationalSchema);
module.exports = Educational;
