const express = require('express');
const {
  landingPage,
  postRegister,
  postLogin,
  getLogin,
  getRegister,
  getLogout
} = require('../controllers');
const { asyncErrorHandler } = require('../middleware');

const router = express.Router();

router.get('/', asyncErrorHandler(landingPage));
router.get('/register', getRegister);
router.post('/register', asyncErrorHandler(postRegister));
router.get('/login', getLogin);
router.post('/login', asyncErrorHandler(postLogin));
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
