const { model, Schema } = require('mongoose');

const lateLogSchema = new Schema(
    {
        teacherGoogleId: {
            type: String,
            required: true
        },
        studentName: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        timeIn: {
            type: Date,
            required: true
        }
    });

module.exports = model('LateLog', lateLogSchema);