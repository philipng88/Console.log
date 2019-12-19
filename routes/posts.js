const express = require('express');
const multer = require('multer');
const { asyncErrorHandler } = require('../middleware');
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
router.get('/new', postNew);
router.post('/', upload.array('images', 4), asyncErrorHandler(postCreate));
router.get('/:id', asyncErrorHandler(postShow));
router.get('/:id/edit', asyncErrorHandler(postEdit));
router.put('/:id', upload.array('images', 4), asyncErrorHandler(postUpdate));
router.delete('/:id', asyncErrorHandler(postDelete));

module.exports = router;
