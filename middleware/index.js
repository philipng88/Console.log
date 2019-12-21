const Review = require('../models/review');
const Post = require('../models/post');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary/profileImage');

const escapeRegExp = string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const middleware = {
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
      middleware.deleteProfileImage(req);
      req.session.error = 'Incorrect current password';
      return res.redirect('/profile');
    }
  },

  changePassword: async (req, res, next) => {
    const { newPassword, passwordConfirmation } = req.body;
    if (newPassword && !passwordConfirmation) {
      middleware.deleteProfileImage(req);
      req.session.error = 'Missing password confirmation';
      res.redirect('/profile');
    } else if (newPassword && passwordConfirmation) {
      const { user } = res.locals;
      if (newPassword === passwordConfirmation) {
        await user.setPassword(newPassword);
        next();
      } else {
        middleware.deleteProfileImage(req);
        req.session.error = 'Passwords do not match';
        return res.redirect('/profile');
      }
    } else {
      next();
    }
  },

  deleteProfileImage: async req => {
    if (req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);
  },

  async searchAndFilterPosts(req, res, next) {
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length) {
      const dbQueries = [];
      // eslint-disable-next-line prefer-const
      let { search, price, avgRating } = req.query;

      if (search) {
        search = new RegExp(escapeRegExp(search), 'gi');
        dbQueries.push({
          $or: [
            { title: search },
            { description: search },
            { location: search },
          ],
        });
      }

      if (price) {
        if (price.min) dbQueries.push({ price: { $gte: price.min } });
        if (price.max) dbQueries.push({ price: { $lte: price.max } });
      }

      if (avgRating) {
        dbQueries.push({ avgRating: { $in: avgRating } });
      }

      res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
    }

    res.locals.query = req.query;
    queryKeys.splice(queryKeys.indexOf('page'), 1);
    const delimiter = queryKeys.length ? '&' : '?';
    res.locals.paginateUrl =
      req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`; //eslint-disable-line
    next();
  },
};

module.exports = middleware;
