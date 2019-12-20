const express = require('express');
const {
  landingPage,
  postRegister,
  postLogin,
  getLogin,
  getRegister,
  getLogout,
  getProfile,
  updateProfile,
} = require('../controllers');
const {
  asyncErrorHandler,
  isLoggedIn,
  isValidPassword,
  changePassword,
} = require('../middleware');

const router = express.Router();

router.get('/', asyncErrorHandler(landingPage));
router.get('/register', getRegister);
router.post('/register', asyncErrorHandler(postRegister));
router.get('/login', getLogin);
router.post('/login', asyncErrorHandler(postLogin));
router.get('/logout', getLogout);
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));
router.put(
  '/profile',
  isLoggedIn,
  asyncErrorHandler(isValidPassword),
  asyncErrorHandler(changePassword),
  asyncErrorHandler(updateProfile),
);

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
