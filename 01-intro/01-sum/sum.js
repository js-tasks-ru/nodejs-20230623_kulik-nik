function sum(a, b) {
  if (typeof a === 'number' && typeof b  === 'number') {
    return  a + b;
  }
    throw new TypeError("There is one or both arguments are not numbers");
}

module.exports = sum;
