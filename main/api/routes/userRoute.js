module.exports = (app) => {
  const userController = require('../controllers/userController');

  app.route('/api')
    .get(userController.showAllUsers);


  app.route('/api/:userId')
    .get(userController.showUserById);
};
