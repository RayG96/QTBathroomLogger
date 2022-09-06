const express = require('express');
const multer = require('multer');
const xlsx = require("xlsx");
const upload = multer();
const router = express.Router();
const rosterModel = require('../models/Roster');

router.get('/getRosters/:teacherId', (req, res) => {
    const teacherId = req.params.teacherId;

    rosterModel.find({ teacherGoogleId: teacherId }, (err, docs) => {
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

router.post('/upload', upload.single('rosterFile'), (req, res) => {
    const teacherId = req.body.teacherId;
    const rosterFile = req.file.buffer;

    let roster = xlsx.read(rosterFile);
    let rosterJson = [];
    let studentNames = [];

    const sheetJson = xlsx.utils.sheet_to_json(roster.Sheets[roster.SheetNames[0]]);

    sheetJson.forEach((res) => {
        rosterJson.push(res);
    });

    rosterJson.forEach(e => {
        studentNames.push({
            studentFirstName: e['First Name'],
            studentLastName: e['Last Name']
        });
    });

    new rosterModel({
        teacherGoogleId: teacherId,
        classId: 'CS101',
        students: studentNames
    }).save()
        .then((result) => {
            res.status(200).end();
        })
        .catch(err => {
            console.error(err);
            res.statusMessage = err;
            res.status(500).end();
        });
});

router.post('/remove', (req, res) => {
    const _id = req.body._id;

    rosterModel.findByIdAndDelete(_id, (err) => {
        if (err) {
            console.error(err);
            res.statusMessage = err;
            res.status(500).end();
        }
        else {
            res.status(200).end();
        }
    })
});

module.exports = router;