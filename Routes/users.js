const express = require('express');
const router = express.Router();
const WrapAsync = require('../Utils/WrapAsync');
const passport = require('passport');
const users = require('../connectors/users');

// To register a new user
router.get('/register', users.renderRegister);
router.post('/register', WrapAsync(users.registerUser));

// To login a user
router.get('/login', users.renderLogin);
router.post('/login',passport.authenticate('local',{failureFlash : true,failureRedirect : '/login'}),users.loginUser);

// To logout a user
router.get('/logout',users.logoutUser);

module.exports = router;