const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
const bathroomLogModel = require('../models/BathroomLog');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.post('/sign-out', (req, res) => {
    let teacherId = req.body.teacherId;
    let studentName = req.body.name.toLowerCase();
    let signOutReason = req.body.reason;

    // Create a bathroom log and insert into database
    let model = new bathroomLogModel({
        teacherGoogleId: teacherId,
        studentName: studentName,
        signOutReason: signOutReason,
        date: Date.now(),
        timeOut: Date.now(),
        timeIn: null
    });

    bathroomLogModel.find({ studentName: studentName }, function (err, docs) {
        if (err) {
            console.error(err);
            res.statusMessage = err;
            res.sendStatus(500);
        }
        else {
            if (docs.length === 0) {
                model.save()
                    .then(() => {
                        res.sendStatus(200);
                    })
                    .catch(err => {
                        console.error(err);
                        res.statusMessage = err;
                        res.sendStatus(500);
                    });
            } else {
                res.statusMessage = "Student already signed out";
                res.status(400).end();
            }
        }
    });

});

module.exports = router;