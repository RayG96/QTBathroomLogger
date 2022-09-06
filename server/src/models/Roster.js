const { model, Schema } = require('mongoose');

const rosterSchema = new Schema(
    {
        teacherGoogleId: {
            type: String,
            required: true
        },
        classId: {
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