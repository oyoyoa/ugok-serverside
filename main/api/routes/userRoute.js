module.exports = function (app) {
  const userList = require("../controllers/userController");

  app.route("/users").get(userList.all_users).post(userList.create_user);

  app
    .route("/users/:userId")
    .get(userList.load_user)
    .put(userList.update_user)
    .delete(userList.delete_user);
};
