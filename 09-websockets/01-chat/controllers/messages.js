const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = (await Message.find({
    chat: ctx.user._id
  })).map((msg) => mapMessage(msg));
  ctx.status = 200;
  ctx.type = 'application/json'
  ctx.body = {messages};
};
