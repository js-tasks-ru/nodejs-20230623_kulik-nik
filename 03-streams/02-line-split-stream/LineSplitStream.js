const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  _accum = '';
  arrStr = [];
  constructor(options) {
    super(options);
  }

  get accum() {
    return this._accum;
  }

  set accum(value) {
    this._accum  = value;
  }

  _transform(chunk, encoding, callback) {
    this.accum += chunk.toString()
    if (this.accum.includes(os.EOL)) {
      const [first, second] = this.accum.split(os.EOL);
      this.push(first);
      this.accum = second;
      }
      callback(null, null);
    }

  _flush(callback) {
    this.push(this.accum);
    this.accum = '';
    callback();
  }
}

module.exports = LineSplitStream;
