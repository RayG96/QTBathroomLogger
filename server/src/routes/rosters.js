const express = require('express');
const multer = require('multer');
const xlsx = require("xlsx");
const upload = multer();
const router = express.Router();
const rosterModel = require('../models/Roster');

router.post('/upload', upload.single('rosterFile'), (req, res) => {
    const teacherId = req.body._id;
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
        classId: 'CS100',
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

module.exports = router;