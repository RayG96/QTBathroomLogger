require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bathroomLogModel = require('./src/models/BathroomLog')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
    }).then(() => {
        console.log('MongoDB connection successful')
    }).catch(err => {
        console.error('MongoDB connection error')
    })

    let model = new bathroomLogModel({
        teacherGoogleId: '01561651685465',
        studentName: 'John Doe',
        date: Date.now(),
        timeOut: Date.now(),
        timeIn: null
    })
    // Create a bathroom log and insert into database
    // const article = await bathroomLog.create({
    //   teacherGoogleId: '01561651685465',
    //   studentName: 'John Doe',
    //   date: Date.now(),
    //   timeOut: Date.now(),
    //   timeIn: null
    // });

    // let log = await bathroomLog.findOneAndUpdate({_id: "630fb9a4aa6180db7cc3d76b" }, {timeIn: Date.now()}, {
    //   new: true
    // });

    model.save()
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            console.error(err);
        })
    let log = await bathroomLogModel.find({ timeIn: null })
    console.log(log);
}