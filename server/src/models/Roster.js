const { model, Schema } = require('mongoose');

const rosterSchema = new Schema(
    {
        teacherGoogleId: {
            type: String,
            required: true
        },
        schoolYear: {
            type: String,
            required: true
        },
        term: {
            type: String,
            required: true
        },
        markingPeriod: {
            type: String,
            required: true
        },
        rosterDate: {
            type: String,
            required: true
        },
        students: {
            type: Object,
            required: true
        }
    }
);

module.exports = model('Roster', rosterSchema);