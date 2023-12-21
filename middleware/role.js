const { User } = require("../models/user");
const config = require("config");

module.exports = function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  if (!config.get("requiresAuth")) return next();

  if (!canUpdate(req.user, /* req.params.id ||  */ req.params.userId)) {
    res.status(403);
    return res.send("Access denied.");
  }
  next();
};

//
async function canUpdate(user, userId) {
  //   let usert = await User.findById(userId);
  //   return usert.usersEmail.some((e) => e.email === user.email);
}

async function canView(user, userId) {}

async function scoped(user, users) {
  // if (user.user === ROLE.ADMIN) return users;
  // return users.filter((user) => user.userId === user.id);
}
