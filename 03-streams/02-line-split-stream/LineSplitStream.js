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
      this.accum += chunk.toString();
      if(this.accum.includes(os.EOL)) {
        const spiltedStr = this.accum.split(os.EOL);
        this.accum = spiltedStr.pop();
        spiltedStr.forEach((str)=> {
          this.push(str);
        })
      }
      callback();
    }

  _flush(callback) {
    if(this.accum) {
      this.push(this.accum);
    }
    this.accum = '';
    callback();
  }
}

module.exports = LineSplitStream;
