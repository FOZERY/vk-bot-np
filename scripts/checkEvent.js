const { FindEventError } = require('../utils/Errors.js');

const { findEvent } = require('../utils/findEvent.js');

const { fetchPage, parsePage } = require('./pageScripts.js');

const checkEvent = async (eventToChange) => {
  try {
    let page = await fetchPage();

    const events = parsePage(page);

    indexToChange = events.findIndex((event) =>
      findEvent(eventToChange, event)
    );

    //если такого события нет в таблице
    if (indexToChange == -1) {
      throw new FindEventError('Объект не найден!');
    } else {
      // если есть такое событие возвращаем его
      return events[indexToChange];
    }
  } catch (err) {
    if (err instanceof FindEventError) {
      throw err;
    }
  }
};

module.exports = {
  checkEvent,
};
