const express = require('express');
const multer = require('multer');
const { asyncErrorHandler, isLoggedIn, isAuthor } = require('../middleware');
const { storage } = require('../cloudinary');
const {
  postIndex,
  postNew,
  postCreate,
  postShow,
  postEdit,
  postUpdate,
  postDelete
} = require('../controllers/posts');

const router = express.Router();
const upload = multer({ storage });

router.get('/', asyncErrorHandler(postIndex));
router.get('/new', isLoggedIn, postNew);

router.post(
  '/',
  isLoggedIn,
  upload.array('images', 4),
  asyncErrorHandler(postCreate)
);

router.get('/:id', asyncErrorHandler(postShow));
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor), postEdit);

router.put(
  '/:id',
  isLoggedIn,
  asyncErrorHandler(isAuthor),
  upload.array('images', 4),
  asyncErrorHandler(postUpdate)
);

router.delete(
  '/:id',
  isLoggedIn,
  asyncErrorHandler(isAuthor),
  asyncErrorHandler(postDelete)
);

module.exports = router;
