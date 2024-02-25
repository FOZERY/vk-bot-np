const { PAGE_ID, GROUP_ID, USER_ID } = require('../config.js');

const { _API_VK } = require('../config.js');

const api = _API_VK;

const fetchPage = async () => {
  try {
    let { source } = await api.pages.get({
      owner_id: -GROUP_ID,
      page_id: PAGE_ID,
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
      page_id: PAGE_ID,
      group_id: GROUP_ID,
      user_id: USER_ID,
      title: 'Расписание',
    });
  } catch (err) {
    console.log(err);
  }
};

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

module.exports = {
  fetchPage,
  savePage,
  parsePage,
};
