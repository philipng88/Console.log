const express = require('express');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {
  res.send('Reviews Route');
});

router.post('/', (req, res, next) => {
  res.send('Create Review');
});

router.get('/:review_id/edit', (req, res, next) => {
  res.send('EDIT');
});

router.put('/:review_id', (req, res, next) => {
  res.send('UPDATE');
});

router.delete('/:review_id', (req, res, next) => {
  res.send('DELETE');
});

module.exports = router;
