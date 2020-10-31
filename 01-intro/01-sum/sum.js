function sum(a, b) {
  if ([a, b].some((param) => typeof (param) !== 'number')) {
    throw new TypeError('Parameter should be a number');
  }

  return a+b;
}
module.exports = sum;
