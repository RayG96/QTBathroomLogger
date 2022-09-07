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

    const workbook = xlsx.read(rosterFile);
    let range = xlsx.utils.decode_range(workbook.Sheets[workbook.SheetNames[0]]['!ref']);
    range.s.r = 10;	// Start at row 11
    range.s.c = 0;	// Get columns 0-8
    range.e.c = 8;
    let newRange = xlsx.utils.encode_range(range);
    let roster = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { range: newRange });

    // Get key name of "Status as of (date)" column
    const filteredName = Object.keys(roster[0]).filter((name) => /^Status as of .*/.test(name))[0];
    const expectedHeader = ['Student Name', 'Student ID', 'Student DOE Email', filteredName, 'Grade Level', 'Official Class', 'Course Name', 'Section ID'];

    // Check if header matches expected header
    const rosterValidated = Object.keys(roster[0]).every(v => expectedHeader.includes(v));
    if (rosterValidated) {
        // Get values from A7, A8, A9
        const schoolYear = workbook.Sheets[workbook.SheetNames[0]]['A7'].v.split(':')[1].trim();
        const term = workbook.Sheets[workbook.SheetNames[0]]['A8'].v.split(':')[1].trim();
        const markingPeriod = workbook.Sheets[workbook.SheetNames[0]]['A9'].v.split(':')[1].trim();

        // Parse date of roster
        let rosterDate = roster[roster.length - 2]['Section ID'].split(' ');
        rosterDate = rosterDate.slice(2, rosterDate.length).join(' ');

        roster.forEach(e => {
            // Get key name of "Status as of (date)" column
            const filteredNames = Object.keys(e).filter((name) => /^Status as of .*/.test(name));
            delete e[filteredNames[0]];	// delete key

            // Convert LastName, FirstName to FirstName LastName format
            let name = e['Student Name'].toLowerCase().split(',');
            name = `${name[1]} ${name[0]}`.trim();
            name = name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
            e['Student Name'] = name;
            if (e['Student ID']) e['Student ID'] = e['Student ID'].toString();

            // Convert string to Int
            if (!isNaN(e['Grade Level'])) e['Grade Level'] = parseInt(e['Grade Level'])

            // Delete unneeded keys
            delete e['Official Class'];
            delete e['Student DOE Email'];
            delete e['Section ID'];
        })

        const students = roster.filter(student => Object.keys(student).length === 4);

        new rosterModel({
            teacherGoogleId: teacherId,
            schoolYear: schoolYear,
            term: term,
            markingPeriod: markingPeriod,
            rosterDate: rosterDate,
            students: students
        }).save()
            .then((result) => {
                res.status(200).end();
            })
            .catch(err => {
                console.error(err);
                res.statusMessage = err;
                res.status(500).end();
            });
    } else {
        // Roster Validation Failed
        res.statusMessage = 'Malformed Roster Selected';
        res.status(400).end();
    }

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
    });
});

module.exports = router;