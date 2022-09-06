const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const socketIo = require('socket.io');
const http = require('http');
require('dotenv').config();
require('./src/auth/passportAuth');

const app = express();
const server = http.createServer(app);

app.enable('trust proxy');

const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL
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

function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== 'development') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

(process.env.NODE_ENV === 'production') && app.use(requireHTTPS);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
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
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/auth', require('./src/routes/auth'));
app.use('/transactions', require('./src/routes/studentTransactions'));
app.use('/rosters', require('./src/routes/rosters'));
app.use('/getuser', (req, res) => {
    res.send(req.user);
});
app.get('/health', (req, res) => {
    res.status(200).send('Ok');
});

main().catch(err => console.log(err));

async function main() {

    app.set('socketio', io);
    //Whenever someone connects this gets executed
    io.on('connection', (socket) => {
        // console.log('A user connected');
        io.emit('currentDateTime', Date.now());

        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', () => {
            // console.log('A user disconnected');
        });
    });

    setInterval(() => {
        io.emit('currentDateTime', Date.now());
    }, 1000);

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('../client/build'));
        app.get('*', (request, response) => {
            response.sendFile(path.join(__dirname, '../client/build', 'index.html'));
        });
    } else {
        app.use(express.static('../client/public'));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
        });
        // app.get('/', (req, res) => {
        //     res.send('Hello World!');
        // });
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
    });
}