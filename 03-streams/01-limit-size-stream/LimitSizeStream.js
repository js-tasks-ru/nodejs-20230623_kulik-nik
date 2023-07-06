const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  _accum = 0;

  constructor(options) {
    super(options);
    this.limit = options.limit;
  }

  castToBuffer(chunk, encoding) {
    if(encoding === 'buffer') {
      return chunk;
    } else {
      return Buffer.from(chunk, encoding);
    };
  };

  get accum() {
    return this._accum;
  }
  set accum(value) {
    this._accum = value;
  }

  isLengthNotExceeded(accum) {
    return this.limit > accum;
  };

  processData(chunk, encoding) {
    const bufferChunk = this.castToBuffer(chunk, encoding);
    this.accum += bufferChunk.length;
    if (this.isLengthNotExceeded(this.accum)) {
      return chunk;
    } else {
      throw new LimitExceededError();
    }
  };

  _transform(chunk, encoding, callback) {
    try {
      const processedChunck = this.processData(chunk, encoding)
      callback(null, processedChunck);
    } catch (error) {
      callback(error, null);
    }

  }
}

module.exports = LimitSizeStream;
