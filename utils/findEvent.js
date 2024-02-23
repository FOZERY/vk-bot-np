const findEvent = (eventToDelete, event) => {
  return (
    event.date.year == eventToDelete.date.year &&
    event.date.month == eventToDelete.date.month &&
    event.date.day == eventToDelete.date.day &&
    event.date.startTime == eventToDelete.date.startTime &&
    event.event == eventToDelete.event
  );
};

module.exports = {
  findEvent,
};
