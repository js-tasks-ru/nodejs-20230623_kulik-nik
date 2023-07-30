
const User = require('../../models/User');
module.exports = async function authenticate(strategy, email, displayName, done) {
  if(!email) {
    return done(null, false, 'Не указан email');
  }

  if(!displayName) {
    return done(null, false, 'Не указан login');
  }

  const currUser = await User.findOne({
    email,
    displayName
  });
  if(!currUser) {
    try {
      const registeredUser = await new User({email,displayName,}).save();
      done(null, registeredUser);
    } catch (error) {
      done(error);
    }
  }
  else {
    done(null, currUser);
  }

};
