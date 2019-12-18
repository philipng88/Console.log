const express = require('express');
const { postRegister, postLogin, getLogout } = require('../controllers');
const { asyncErrorHandler } = require('../middleware');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index.pug', { title: 'Console.log', pageTitle: 'Home' });
});

router.get('/register', (req, res, next) => {
  res.send('Register page');
});

router.post('/register', asyncErrorHandler(postRegister));

router.get('/login', (req, res, next) => {
  res.send('Login page');
});

router.post('/login', postLogin);
router.get('/logout', getLogout);

router.get('/profile', (req, res, next) => {
  res.send('Profile page');
});

router.put('/profile/:user_id', (req, res, next) => {
  res.send('Edit Profile');
});

router.get('/forgot', (req, res, next) => {
  res.send('Forgot password form');
});

router.put('/forgot', (req, res, next) => {
  res.send('Forgot password');
});

router.get('/reset/:token', (req, res, next) => {
  res.send('Reset password form');
});

router.put('/reset/:token', (req, res, next) => {
  res.send('Reset password');
});

module.exports = router;
