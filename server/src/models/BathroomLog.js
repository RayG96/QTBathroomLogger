const { model, Schema } = require('mongoose');

const bathroomLogSchema = new Schema(
    {
        teacherGoogleId: {
            type: String,
            required: true
        },
        studentName: {
            type: String,
            required: true
        },
        signOutReason: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        timeOut: {
            type: Date,
            required: true
        },
        timeIn: {
            type: Date,
            default: null
        },
        totalTimeOut: {
            type: Number,
            default: 0
        }
    });

module.exports = model('BathroomLog', bathroomLogSchema);