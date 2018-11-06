var ctrl = require('../controllers/appControllers');

// Routes
module.exports = function(app) {
  // app.route('/auth/register').post(ctrl.authRegister);
  app.route('/auth/register/user').post(ctrl.authRegisterUser);
  app.route('/user/new/location').post(ctrl.newLocation);
  app.route('/user/new/stream').post(ctrl.newStream);
  app.route('/user/map/location').post(ctrl.mapUserLocation);
  app.route('/user/map/stream').post(ctrl.mapUserStream);
  app.route('/auth/map/location').post(ctrl.authUserLocation);
  app.route('/auth/map/stream').post(ctrl.authUserStream);
  app.route('/get/location').post(ctrl.locationAsParent);
  app.route('/get/stream').post(ctrl.streamsAsParent);
  app.route('/get/request/location').post(ctrl.locationRequest);
  app.route('/get/request/stream').post(ctrl.streamRequest);
  app.route('/auth/login').post(ctrl.authLogin);
  app.route('/get/users').get(ctrl.getUsers);
};