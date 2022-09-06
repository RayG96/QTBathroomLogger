const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bathroomLogModel = require('../models/BathroomLog');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/getCurrentlySignedOut/:teacherId', (req, res) => {
    let teacherId = req.params.teacherId;
    bathroomLogModel.find({ teacherGoogleId: teacherId, timeIn: null }, function (err, docs) {
        if (err) {
            console.error(err);
            res.statusMessage = err;
            res.status(500).end();
        }
        else {
            res.status(200).send(docs);
        }
    });
});

router.post('/sign-out', (req, res) => {
    let teacherId = req.body.teacherId;
    let studentName = req.body.name;
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

    bathroomLogModel.find({ teacherGoogleId: teacherId, studentName: { $regex: new RegExp(`^${studentName}$`), $options: 'i' }, timeIn: null }, function (err, docs) {
        if (err) {
            console.error(err);
            res.statusMessage = err;
            res.status(500).end();
        }
        else {
            if (docs.length === 0) {
                model.save()
                    .then((result) => {
                        let io = req.app.get('socketio');
                        io.emit('currentDateTime', Date.now());
                        io.sockets.emit('studentTransaction', { action: 'add', result: result });
                        res.status(200).end();
                    })
                    .catch(err => {
                        console.error(err);
                        res.statusMessage = err;
                        res.status(500).end();
                    });
            } else {
                res.statusMessage = 'Student already signed out';
                res.status(400).end();
            }
        }
    });
});

router.post('/sign-in', (req, res) => {
    let _id = req.body._id;
    let currentTime = Date.now();
    bathroomLogModel.findOneAndUpdate({ _id: _id }, { timeIn: currentTime }, {
        new: true
    }).then(result => {
        if (result.timeIn !== null) {
            let io = req.app.get('socketio');
            io.sockets.emit('studentTransaction', { action: 'delete', result: result });
            res.status(200).end();
        } else {
            res.statusMessage = 'Unable to sign in';
            res.status(400).end();
        }
    }).catch(err => {
        console.error(err);
        res.statusMessage = err;
        res.status(500).end();
    });
});

module.exports = router;