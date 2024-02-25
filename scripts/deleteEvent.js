const { FindEventError } = require('../utils/Errors.js');

const { findEvent } = require('../utils/findEvent.js');

const { fetchPage, savePage, parsePage } = require('./pageScripts.js');

const deleteFromEvents = (events, eventToDelete) => {
  indexToDelete = events.findIndex((event) => findEvent(eventToDelete, event));
  if (indexToDelete == -1) {
    throw new FindEventError('Объект не найден!');
  } else {
    events.splice(indexToDelete, 1);

    let newSchedule = events.reduce((acc, event) => {
      return `${acc}|-\n| ${event.date.day}.${event.date.month}.${event.date.year}\n| ${event.date.time}\n| ${event.event}\n| ${event.address}\n| ${event.organizer}\n`;
    }, '');
    newSchedule = `{|\n${newSchedule}|}`;

    return newSchedule;
  }
};

const deleteEvent = async (eventToDelete) => {
  try {
    let page = await fetchPage();

    const events = parsePage(page);

    const newSchedule = deleteFromEvents(events, eventToDelete);

    await savePage(newSchedule);
  } catch (err) {
    if (err instanceof FindEventError) {
      throw err;
    }
  }
};

module.exports = {
  deleteEvent,
};
