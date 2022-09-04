const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/failedLogin` }), (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}`);
});

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect(process.env.CLIENT_URL);
        });
    }
});

module.exports = router;