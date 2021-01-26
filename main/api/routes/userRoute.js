module.exports = (app) => {
  const userController = require('../controllers/userController');

  app.route('/api/users')
    .get(userController.showAllUsers);


  app.route('/api/user/:userId')
    .get(userController.showUserById);
};
