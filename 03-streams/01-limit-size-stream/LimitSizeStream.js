const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = +options.limit || Number.MAX_SAFE_INTEGER;
    this.size = 0;
  }

  _transform(chunk, encoding, callback) {
    this.size += chunk.length;
    let error = (this.size > this.limit) ? new LimitExceededError() : null;
    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
