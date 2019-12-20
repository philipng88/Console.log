const Review = require('../models/review');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = {
  asyncErrorHandler: fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  },

  isReviewAuthor: async (req, res, next) => {
    const review = await Review.findById(req.params.review_id);
    if (review.author.equals(req.user._id)) {
      return next();
    }
    req.session.error = 'Invalid user permissions';
    return res.redirect('/');
  },

  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.error = 'Please log in';
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
  },

  isAuthor: async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (post.author.equals(req.user._id)) {
      res.locals.post = post;
      return next();
    }
    req.session.error = 'Invalid user permissions';
    res.redirect('back');
  },

  isValidPassword: async (req, res, next) => {
    const { user } = await User.authenticate()(
      req.user.username,
      req.body.currentPassword,
    );
    if (user) {
      res.locals.user = user;
      next();
    } else {
      req.session.error = 'Incorrect current password';
      return res.redirect('/profile');
    }
  },

  changePassword: async (req, res, next) => {
    const { newPassword, passwordConfirmation } = req.body;
    if (newPassword && !passwordConfirmation) {
      req.session.error = 'Missing password confirmation';
      res.redirect('/profile');
    } else if (newPassword && passwordConfirmation) {
      const { user } = res.locals;
      if (newPassword === passwordConfirmation) {
        await user.setPassword(newPassword);
        next();
      } else {
        req.session.error = 'Passwords do not match';
        return res.redirect('/profile');
      }
    } else {
      next();
    }
  },
};
