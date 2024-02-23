const { API } = require('vk-io');

const { USER_TOKEN } = require('../config.js');

const { FindEventError } = require('../utils/Errors.js');

const { findEvent } = require('../utils/findEvent.js');

const api = new API({
  token: USER_TOKEN,
  apiVersion: '5.199',
});

const fetchPage = async () => {
  try {
    let { source } = await api.pages.get({
      owner_id: -224632380,
      page_id: 53660422,
      need_source: 1,
    });
    return source;
  } catch (err) {
    console.log(err);
  }
};

const savePage = async (text) => {
  try {
    await api.pages.save({
      text: text,
      page_id: 53660422,
      group_id: 224632380,
      user_id: 137128439,
      title: 'Расписание',
    });
  } catch (err) {
    console.log(err);
  }
};

// parse page into array of event objects
const parsePage = (page) => {
  page = page.replace(/{\||\|}/g, '').replace(/\n<br\/>/g, '');
  let events = page
    .split('|-\n')
    .filter((str) => str.trim() !== '')
    .map((str) => {
      const values = str
        .split('\n')
        .filter((item) => item.trim() !== '')
        .map((item) => item.replace('| ', ''));
      const year = values[0].trim().split('.')[2]
        ? values[0].trim().split('.')[2]
        : '2024';
      const month = values[0].trim().split('.')[1];
      const day = values[0].trim().split('.')[0];
      const time = values[1]
        .trim()
        .split('-')
        .map((item) => item.trim())
        .join(' - '); // делаем одинаковые отступы 15:00 - 16:00
      const [startTime, endTime] = time.split('-').map((item) => item.trim()); // разбиваем на стартовое и конечное время

      return {
        date: {
          year: year,
          month: month,
          day: day,
          time: time,
          startTime: startTime,
          endTime: endTime,
        },
        event: values[2].trim(),
        address: values[3].trim(),
        organizer: values[4].trim(),
      };
    });

  return events;
};

const deleteFromEvents = async (events, eventToDelete) => {
  indexToDelete = events.findIndex((event) => findEvent(eventToDelete, event));
  if (indexToDelete == -1) {
    throw new FindEventError('Объект не найден!');
  } else {
    events.splice(indexToDelete, 1);

    let newSchedule = events.reduce((acc, event) => {
      return `${acc}|-\n| ${event.date.day}.${event.date.month}.${event.date.year}\n| ${event.date.time}\n| ${event.event}\n| ${event.address}\n| ${event.organizer}\n`;
    }, '');
    newSchedule = `{|\n${newSchedule}|}`;

    await savePage(newSchedule);
  }
};

const deleteEvent = async (newEvent) => {
  try {
    let page = await fetchPage();

    const events = parsePage(page);
    await deleteFromEvents(events, newEvent);
  } catch (err) {
    if (err instanceof FindEventError) {
      throw err;
    }
  }
};

module.exports = {
  deleteEvent,
};
