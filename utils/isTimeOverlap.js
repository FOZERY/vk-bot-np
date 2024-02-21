const isTimeOverlap = (newEvent, event) => {
  const newEventStartDate = new Date(
    `${newEvent.date.year}-${newEvent.date.month}-${newEvent.date.day}T${newEvent.date.startTime}`
  );
  const eventStartDate = new Date(
    `${event.date.year}-${event.date.month}-${event.date.day}T${event.date.startTime}`
  );
  const newEventEndDate = newEvent.date.endTime // если нет времени окончания, то undefined
    ? new Date(
        `${newEvent.date.year}-${newEvent.date.month}-${newEvent.date.day}T${newEvent.date.endTime}`
      )
    : undefined;
  const eventEndDate = event.date.endTime // если нет времени окончания, то undefined
    ? new Date(
        `${event.date.year}-${event.date.month}-${event.date.day}T${event.date.endTime}`
      )
    : undefined;

  if (
    // выбирается для сравнения событие в один день в одном и том же месте
    newEvent.date.year == event.date.year &&
    newEvent.date.month == event.date.month &&
    newEvent.date.day == event.date.day &&
    newEvent.address == event.address
  ) {
    if (
      // проверка промежутков времени, все 4 случая, учитывая, есть ли время окончания события или нет
      (newEventEndDate &&
        !eventEndDate &&
        newEventStartDate <= eventStartDate &&
        newEventEndDate > eventStartDate) ||
      (!newEventEndDate &&
        eventEndDate &&
        newEventStartDate >= eventStartDate &&
        newEventStartDate < eventEndDate) ||
      (newEventEndDate &&
        eventEndDate &&
        newEventStartDate < eventEndDate &&
        newEventEndDate > eventStartDate) ||
      (!newEventEndDate && !eventEndDate && newEventStartDate == eventStartDate)
    ) {
      return true;
    }
  }

  return false;
};

module.exports = {
  isTimeOverlap,
};
