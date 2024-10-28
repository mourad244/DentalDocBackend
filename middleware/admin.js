const requireAuth = process.env.REQUIRE_AUTH;
module.exports = function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  if (!requireAuth) return next();
  console.log(req.user);
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  next();
};
