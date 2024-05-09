const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getWorkouts', mid.requiresLogin, controllers.Workout.getWorkouts);

  app.get('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.login);

  // app.get('/signup', mid.requireSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requireSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Workout.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Workout.makeWorkout);

  app.get('/channel', mid.requiresLogin, controllers.Channel.channelPage);
  app.post('/premium', mid.requiresLogin, controllers.Channel.togglePremium);

  app.post('/changePassword', controllers.Account.passwordChange);

  app.get('/', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
  
  app.get('/*', controllers.Account.notFound);

};

module.exports = router;
