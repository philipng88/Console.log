const express = require('express');
const { asyncErrorHandler, isReviewAuthor } = require('../middleware');
const {
  reviewCreate,
  reviewUpdate,
  reviewDelete
} = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

router.post('/', asyncErrorHandler(reviewCreate));
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDelete));

module.exports = router;
