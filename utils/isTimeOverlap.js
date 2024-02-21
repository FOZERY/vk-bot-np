const isTimeOverlap = (newEvent, event) => {
  return (
    newEvent.date.startTime < event.date.endTime &&
    newEvent.date.endTime > event.date.startTime &&
    newEvent.date.year == event.date.year &&
    newEvent.date.month == event.date.month &&
    newEvent.date.day == event.date.day &&
    newEvent.address == event.address
  );
};

module.exports = {
  isTimeOverlap,
};
