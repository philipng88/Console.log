require('dotenv').config();
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const seedPosts = require('./seeds');
// seedPosts();

const User = require('./models/user');

// Require Routes
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const reviewsRouter = require('./routes/reviews');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .catch(error => console.log(error));
mongoose.connection.on('connected', () =>
  console.log('Database connection successful')
);
mongoose.connection.on('error', err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Configure passport and sessions
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set local variables
app.use((req, res, next) => {
  // Set default user for development
  req.user = {
    // eslint-disable-next-line prettier/prettier
    _id: '5df8452df54e022b44d9fe2f',
    // eslint-disable-next-line prettier/prettier
    username: 'Homer'
  };
  res.locals.currentUser = req.user;
  // Set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;

  // Set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  next();
});

// Mount Routes
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // res.status(err.status || 500);
  // res.render('error', { pageTitle: 'ERROR' });
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

app.listen(port, () => {
  console.log(`The app has started on port ${port}`);
});
