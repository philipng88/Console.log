const Post = require('../models/post');

module.exports = {
  async postIndex(req, res, next) {
    const posts = await Post.find({});
    res.render('posts/index', { posts, pageTitle: 'Posts' });
  },

  postNew(req, res, next) {
    res.render('posts/new', { pageTitle: 'Create New Post' });
  },

  async postCreate(req, res, next) {
    const post = await Post.create(req.body.post);
    res.redirect(`/posts/${post.id}`);
  },

  async postShow(req, res, next) {
    const post = await Post.findById(req.params.id);
    res.render('posts/show', { post, pageTitle: `${post.title}` });
  },

  async postEdit(req, res, next) {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post, pageTitle: 'Edit Post' });
  },

  async postUpdate(req, res, next) {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body.post, {
      new: true
    });
    res.redirect(`/posts/${post.id}`);
  },

  async postDelete(req, res, next) {
    await Post.findByIdAndRemove(req.params.id);
    res.redirect('/posts');
  }
};
