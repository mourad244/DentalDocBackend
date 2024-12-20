const jwt = require("jsonwebtoken");
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
const { Role } = require("../models/role");

module.exports = async function (req, res, next) {
  const roles = await Role.find();
  // find roles in roles having nom === "admin" or "chef"
  let roleIds = [];
  roles.map((role) => {
    if (role.nom === "admin" || role.nom === "chef")
      roleIds.push(role._id.toString());
  });

  if (!jwtPrivateKey) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(token, jwtPrivateKey);

    if (!roleIds.includes(decoded.roleId.toString()))
      return res.status(401).send("Access denied. not authorized.");
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
