const { Keyboard } = require('vk-io');

const dateKeyboardGenerator = () => {
  const date = new Date();
  let day;
  let month;
  const keyboard = Keyboard.builder();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      day = ('0' + date.getDate()).slice(-2);
      month = ('0' + (date.getMonth() + 1)).slice(-2);

      keyboard.textButton({
        label: `${day}.${month}`,
        color: Keyboard.POSITIVE_COLOR,
        payload: {
          date: {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
          },
        },
      });
      date.setDate(date.getDate() + 1);
    }
    keyboard.row();
  }

  return keyboard;
};

const timeKeyboard = Keyboard.builder()
  .textButton({
    label: '00:00',
    payload: {},
  })
  .textButton({ label: '01:00', payload: {} })
  .textButton({ label: '02:00', payload: {} })
  .textButton({ label: '03:00', payload: {} })
  .row()
  .textButton({ label: '04:00', payload: {} })

  .textButton({ label: '05:00', payload: {} })
  .textButton({ label: '06:00', payload: {} })
  .textButton({ label: '07:00', payload: {} })
  .row()
  .textButton({ label: '08:00', payload: {} })

  .textButton({ label: '09:00', payload: {} })
  .textButton({ label: '10:00', payload: {} })
  .textButton({ label: '11:00', payload: {} })
  .row()
  .textButton({ label: '12:00', payload: {} })

  .textButton({ label: '13:00', payload: {} })
  .textButton({ label: '14:00', payload: {} })
  .textButton({ label: '15:00', payload: {} })
  .row()
  .textButton({ label: '16:00', payload: {} })

  .textButton({ label: '17:00', payload: {} })
  .textButton({ label: '18:00', payload: {} })
  .textButton({ label: '19:00', payload: {} })
  .row()

  .textButton({ label: '20:00', payload: {} })

  .textButton({ label: '21:00', payload: {} })
  .textButton({ label: '22:00', payload: {} })
  .textButton({ label: '23:00', payload: {} })
  .row();

const menuKeyboard = Keyboard.builder()
  .textButton({
    label: 'Добавить в расписание',
    color: Keyboard.POSITIVE_COLOR,
    payload: {
      command: 'add',
    },
  })
  .row()
  .textButton({
    label: 'Изменить расписание',
    color: Keyboard.PRIMARY_COLOR,
    payload: {
      command: 'change',
    },
  })
  .row()
  .textButton({
    label: 'Удалить из расписания',
    color: Keyboard.NEGATIVE_COLOR,
    payload: {
      command: 'delete',
    },
  });

const addDateKeyboard = dateKeyboardGenerator();

module.exports = {
  menuKeyboard,
  addDateKeyboard,
  timeKeyboard,
};
