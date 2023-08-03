const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');


module.exports.register = async (ctx, next) => {
  const {
      displayName,
      email,
      password,
  } = ctx.request.body;

  const verificationToken = uuid();
  const user = new User({
    displayName,
    email,
    verificationToken,
  });
await user.setPassword(password);

await user.save();

await sendMail({
    template: 'confirmation',
    locals: {token: verificationToken},
    to: email,
    subject: 'Подтвердите почту',
});

ctx.status = 200;
ctx.type = 'text/html; charset=utf-8';
ctx.body = {
  status: 'ok',
};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({
    verificationToken
  })
  if(!user) ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  user.verificationToken = undefined;
  await user.save()
 const authToken = uuid();

  ctx.status = 200;
  ctx.type = 'application/json'
  ctx.body = {token: authToken};

};
