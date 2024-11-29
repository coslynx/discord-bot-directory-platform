const passport = require('passport');

const adminAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    if (!user || !user.role === 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = adminAuth;

```