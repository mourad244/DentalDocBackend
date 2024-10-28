const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const requireAuth = process.env.REQUIRE_AUTH;
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
  if (!requireAuth) return next();
  console.log(req.user);
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
