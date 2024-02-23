
class OverlapError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OverlapError';
  }
}

module.exports = {
  FindEventError,
  OverlapError,
};
