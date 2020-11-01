const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    options.decodeStrings = false;
    super(options);

    this.trail = "";
  }

  _transform(chunk, encoding, callback) {
    var lines = (this.trail+chunk).split(os.EOL);
    this.trail = lines.pop();
    lines.forEach(this.push.bind(this));
    callback();
  }

  _flush(callback) {
    console.log('flush');
    if (this.trail.length > 0) {
      this.push(this.trail);
      this.trail = "";
    }
    callback();
  }
}

module.exports = LineSplitStream;
