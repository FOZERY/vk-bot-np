const { isTimeOverlap } = require('../utils/isTimeOverlap.js');

const { compareByDate } = require('../utils/compareByDate.js');

const { OverlapError } = require('../utils/Errors.js');

const { fetchPage, savePage, parsePage } = require('./pageScripts.js');

const insertNewEvent = (events, newEvent) => {
  if (events.some((event) => isTimeOverlap(newEvent, event))) {
    throw new OverlapError('Такой объект уже есть!');
  }
  events.push(newEvent); // push new event object in events array

  // sort table with events by date
  events.sort(compareByDate);

  let newSchedule = events.reduce((acc, event) => {
    return `${acc}|-\n| ${event.date.day}.${event.date.month}.${event.date.year}\n| ${event.date.time}\n| ${event.event}\n| ${event.address}\n| ${event.organizer}\n`;
  }, '');
  newSchedule = `{|\n${newSchedule}|}`;

  return newSchedule;
};

const postNewEvent = async (newEvent) => {
  try {
    let page = await fetchPage();
    const events = parsePage(page);

    const newSchedule = insertNewEvent(events, newEvent);

    await savePage(newSchedule);
  } catch (err) {
    if (err instanceof OverlapError) {
      throw err;
    }
  }
};

module.exports = {
  postNewEvent,
};
