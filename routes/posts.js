const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Posts Route');
});

router.get('/new', (req, res, next) => {
  res.send('New Post');
});

router.post('/', (req, res, next) => {
  res.send('Create Post');
});

router.get('/:id', (req, res, next) => {
  res.send('/posts/:id');
});

router.get('/:id/edit', (req, res, next) => {
  res.send('EDIT');
});

router.put('/:id', (req, res, next) => {
  res.send('UPDATE');
});

router.delete('/:id', (req, res, next) => {
  res.send('DELETE');
});

module.exports = router;
