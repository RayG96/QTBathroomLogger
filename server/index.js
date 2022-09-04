require('dotenv').config()
require('./src/auth/passportAuth');
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const app = express();
const { Schema } = mongoose;

const corsPolicy = async (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
};

app.options('*', cors());
app.use(corsPolicy);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.DATABASE_URL,
        }),
        cookie: {
            sameSite: `${process.env.NODE_ENV === 'production' ? 'none' : 'lax'}`, // cross site // set lax while working with http:localhost, but none when in prod
            secure: `${process.env.NODE_ENV === 'production' ? 'true' : 'auto'}`, // only https // auto when in development, true when in prod
            maxAge: 1000 * 60 * 60 * 24 * 14, // expiration time
        },
    })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./src/routes/auth'));
app.use('/transactions', require('./src/routes/studentTransactions'));
app.use('/getuser', (req, res) => {
    res.send(req.user);
});
main().catch(err => console.log(err));

async function main() {

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('../client/build'));
        app.get('*', (request, response) => {
            response.sendFile(path.join(__dirname, '../client/build', 'index.html'));
        });
    } else {

        app.use(express.static('../client/public'));
        app.get('/', (req, res) => {
            res.send('Hello World!');
        });
    }

    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
    }).then(() => {
        console.log('MongoDB connection successful')
        return app.listen({ port: process.env.PORT });
    }).then((res) => {
        console.log(`Server running at http://localhost:${process.env.PORT}`);
    }).catch(err => {
        console.error(err)
    })

    // let model = new bathroomLogModel({
    //     teacherGoogleId: '01561651685465',
    //     studentName: 'John Doe',
    //     date: Date.now(),
    //     timeOut: Date.now(),
    //     timeIn: null
    // })
    // // Create a bathroom log and insert into database
    // // const article = await bathroomLog.create({
    // //   teacherGoogleId: '01561651685465',
    // //   studentName: 'John Doe',
    // //   date: Date.now(),
    // //   timeOut: Date.now(),
    // //   timeIn: null
    // // });

    // // let log = await bathroomLog.findOneAndUpdate({_id: "630fb9a4aa6180db7cc3d76b" }, {timeIn: Date.now()}, {
    // //   new: true
    // // });

    // model.save()
    //     .then(doc => {
    //         console.log(doc);
    //     })
    //     .catch(err => {
    //         console.error(err);
    //     })
    // let log = await bathroomLogModel.find({ timeIn: null })
    // console.log(log);
}