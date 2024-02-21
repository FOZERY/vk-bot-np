const { VK, API } = require('vk-io');

const { USER_TOKEN } = require('./config.js');

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
      return {
        date: {
          year: '2024',
          month: values[0].trim().split('.')[1],
          day: values[0].trim().split('.')[0],
          time: values[1].trim(),
        },
        event: values[2].trim(),
        address: values[3].trim(),
        organizer: values[4].trim(),
      };
    });
  return events;
};

// sort by date function
function compareByDate(a, b) {
  aTime = a.date.time.split('-').map((item) => item.trim())[0];
  aDate = new Date(`${a.date.year}-${a.date.month}-${a.date.day}T${aTime}`);
  bTime = b.date.time.split('-').map((item) => item.trim())[0];
  bDate = new Date(`${b.date.year}-${b.date.month}-${b.date.day}T${bTime}`);

  if (aDate < bDate) {
    return -1;
  }
  if (aDate > bDate) {
    return 1;
  }
  return 0;
}

const insertNewEvent = async (events, newEvent) => {
  /*if (events.find((event) => event.event === newEvent.event)) {
    console.log('Элемент с таким названием уже есть');
    return;
  }
  */

  events.push(newEvent); // push new event object in events array

  // sort table with events by date
  events.sort(compareByDate);

  let newSchedule = events.reduce((acc, event) => {
    return `${acc}|-\n| ${event.date.day}.${event.date.month}\n| ${event.date.time}\n| ${event.event}\n| ${event.address}\n| ${event.organizer}\n`;
  }, '');
  newSchedule = `{|\n${newSchedule}|}`;

  await savePage(newSchedule);
};

const postNewEvent = async (newEvent) => {
  try {
    let page = await fetchPage();

    const events = parsePage(page);

    insertNewEvent(events, newEvent);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  postNewEvent,
};
