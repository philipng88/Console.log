const express = require('express');

const router = express.Router();
const { postRegister } = require('../controllers/index');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Console.log' });
});

router.get('/register', (req, res, next) => {
  res.send('Register page');
});

router.post('/register', postRegister);

router.get('/login', (req, res, next) => {
  res.send('Login page');
});

router.post('/login', (req, res, next) => {
  res.send('Login');
});

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
