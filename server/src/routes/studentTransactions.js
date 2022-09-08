const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bathroomLogModel = require('../models/BathroomLog');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/getCurrentlySignedOut/:teacherId', (req, res) => {
    const teacherId = req.params.teacherId;

    bathroomLogModel.find({ teacherGoogleId: teacherId, timeIn: null }, (err, docs) => {
        if (err) {
            console.error(err);
            // res.statusMessage = err;
            res.status(500).send(err);
        }
        else {
            res.status(200).send(docs);
        }
    });
});

router.post('/sign-out', (req, res) => {
    const teacherId = req.body.teacherId;
    const studentName = req.body.name;
    const signOutReason = req.body.reason;

    // Create a bathroom log and insert into database
    const model = new bathroomLogModel({
        teacherGoogleId: teacherId,
        studentName: studentName,
        signOutReason: signOutReason,
        date: Date.now(),
        timeOut: Date.now(),
        timeIn: null
    });
    
    // Regex to make student name filter case-insensitive
    bathroomLogModel.find({ teacherGoogleId: teacherId, studentName: { $regex: new RegExp(`^${studentName}$`), $options: 'i' }, timeIn: null }, function (err, docs) {
        if (err) {
            console.error(err);
            // res.statusMessage = err;
            res.status(500).send(err);
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
                        // res.statusMessage = err;
                        res.status(500).send(err);
                    });
            }
            else {
                // res.statusMessage = 'Student already signed out';
                res.status(400).send('Student already signed out');
            }
        }
    });
});

router.post('/sign-in', (req, res) => {
    const _id = req.body._id;
    const currentTime = Date.now();
    
    bathroomLogModel.findOneAndUpdate({ _id: _id }, { timeIn: currentTime }, {
        new: true
    }).then(result => {
        if (result.timeIn !== null) {
            let io = req.app.get('socketio');
            io.sockets.emit('studentTransaction', { action: 'delete', result: result });
            res.status(200).end();
        }
        else {
            // res.statusMessage = 'Unable to sign in';
            res.status(400).send('Unable to sign in');
        }
    }).catch(err => {
        console.error(err);
        // res.statusMessage = err;
        res.status(500).send(err);
    });
});

module.exports = router;