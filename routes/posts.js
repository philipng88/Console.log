const express = require('express');
const { asyncErrorHandler } = require('../middleware');
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

router.get('/', asyncErrorHandler(postIndex));
router.get('/new', postNew);
router.post('/', asyncErrorHandler(postCreate));
router.get('/:id', asyncErrorHandler(postShow));
router.get('/:id/edit', asyncErrorHandler(postEdit));
router.put('/:id', asyncErrorHandler(postUpdate));
router.delete('/:id', asyncErrorHandler(postDelete));

module.exports = router;
