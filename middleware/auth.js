const jwt = require("jsonwebtoken");
const requireAuth = process.env.REQUIRE_AUTH;
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

module.exports = function (req, res, next) {
  if (!requireAuth) return next();
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(token, jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
//
