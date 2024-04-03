const { _API_VK } = require('../config.js');

const { FindEventError, OverlapError } = require('../utils/Errors.js');

const { compareByDate } = require('../utils/compareByDate.js');

const { isTimeOverlap } = require('../utils/isTimeOverlap.js');

const { findEvent } = require('../utils/findEvent.js');

const { fetchPage, savePage, parsePage } = require('./pageScripts.js');

const insertChangedEvent = (events, eventToChange, newEvent) => {
  indexToChange = events.findIndex((event) => findEvent(eventToChange, event));

  events.splice(indexToChange, 1);

  if (indexToChange === -1) {
    throw new FindEventError('Событие не найдено!');
  }

  if (events.some((event) => isTimeOverlap(newEvent, event))) {
    throw new OverlapError('Событие с таким временем уже есть!');
  }

  events.splice(indexToChange, 0, newEvent);

  events.sort(compareByDate);

  let newSchedule = events.reduce((acc, event) => {
    return `${acc}|-\n| ${event.date.day}.${event.date.month}.${event.date.year}\n| ${event.date.time}\n| ${event.event}\n| ${event.address}\n| ${event.organizer}\n`;
  }, '');
  newSchedule = `{|\n${newSchedule}|}`;

  return newSchedule;
};

const changeEvent = async (newEvent, eventToChange) => {
  try {
    let page = await fetchPage();

    const events = parsePage(page);

    const newSchedule = insertChangedEvent(events, eventToChange, newEvent);

    await savePage(newSchedule);
  } catch (err) {
    if (err instanceof FindEventError) {
      throw err;
    }
    if (err instanceof OverlapError) {
      throw err;
    }
  }
};

module.exports = {
  changeEvent,
};
