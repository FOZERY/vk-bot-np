const findEvent = (firstEvent, secondEvent) => {
  return (
    secondEvent.date.year == firstEvent.date.year &&
    secondEvent.date.month == firstEvent.date.month &&
    secondEvent.date.day == firstEvent.date.day &&
    secondEvent.event == firstEvent.event
  );
};

module.exports = {
  findEvent,
};
