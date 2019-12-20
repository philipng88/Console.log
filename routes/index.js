const express = require('express');
const multer = require('multer');
const { storage } = require('../cloudinary/profileImage');

const upload = multer({ storage });
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
router.post(
  '/register',
  upload.single('image'),
  asyncErrorHandler(postRegister),
);
router.get('/login', getLogin);
router.post('/login', asyncErrorHandler(postLogin));
router.get('/logout', getLogout);
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));
router.put(
  '/profile',
  isLoggedIn,
  upload.single('image'),
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
