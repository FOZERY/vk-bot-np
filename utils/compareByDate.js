// sort by date function
function compareByDate(a, b) {
  aDate = new Date(
    `${a.date.year}-${a.date.month}-${a.date.day}T${a.date.startTime}`
  );
  bDate = new Date(
    `${b.date.year}-${b.date.month}-${b.date.day}T${b.date.startTime}`
  );

  if (aDate < bDate) {
    return -1;
  }
  if (aDate > bDate) {
    return 1;
  }
  return 0;
}

module.exports = {
  compareByDate,
};
