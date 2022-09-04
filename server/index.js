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
const socketIo = require('socket.io')
const server = require('http').createServer(app)

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
}) //in case server and client run on different urls
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
app.set('socketio', io);
main().catch(err => console.log(err));

//Whenever someone connects this gets executed
io.on('connection', function (socket) {
    console.log('A user connected');
    io.emit('currentDateTime', Date.now());
    
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

setInterval(() => {
    io.emit('currentDateTime', Date.now());
}, 1000);

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
        return server.listen({ port: process.env.PORT });
    }).then((res) => {
        console.log(`Server running at http://localhost:${process.env.PORT}`);
    }).catch(err => {
        console.error(err)
    })
}