const socketIO = require('socket.io');
const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server, {
    allowEIO3: true
  });
  
  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    if(!token) {
      next(new Error('anonymous sessions are not allowed'));
    }
    try {
      const { user } = await Session.findOne({token}).populate('user');
      socket.user = user;
      next();
    } catch {
      next(new Error("wrong or expired session token"));
    }
  });

  io.on('connection', async function(socket) {

    socket.on('message', async (msg) => {
     const message = new Message({
      user: socket.user.displayName,
      text: msg,
      chat: socket.user._id,
      date: new Date(),
    }); 
    await message.save();    
    });
  });

  return io;
}

module.exports = socket;
