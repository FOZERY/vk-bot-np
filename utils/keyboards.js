const { Keyboard } = require('vk-io');

const timeKeyboard = Keyboard.builder()
  .textButton({
    label: '00:00',
    payload: { date: { time: '00:00', textTime: '00:00' } },
  })
  .textButton({
    label: '01:00',
    payload: { date: { time: '01:00', textTime: '01:00' } },
  })
  .textButton({
    label: '02:00',
    payload: { date: { time: '02:00', textTime: '02:00' } },
  })
  .textButton({
    label: '03:00',
    payload: { date: { time: '03:00', textTime: '03:00' } },
  })
  .textButton({
    label: '04:00',
    payload: { date: { time: '04:00', textTime: '04:00' } },
  })

  .row()

  .textButton({
    label: '05:00',
    payload: { date: { time: '05:00', textTime: '05:00' } },
  })
  .textButton({
    label: '06:00',
    payload: { date: { time: '06:00', textTime: '06:00' } },
  })
  .textButton({
    label: '07:00',
    payload: { date: { time: '07:00', textTime: '07:00' } },
  })
  .textButton({
    label: '08:00',
    payload: { date: { time: '08:00', textTime: '08:00' } },
  })
  .textButton({
    label: '09:00',
    payload: { date: { time: '09:00', textTime: '09:00' } },
  })

  .row()

  .textButton({
    label: '10:00',
    payload: { date: { time: '10:00', textTime: '10:00' } },
  })
  .textButton({
    label: '11:00',
    payload: { date: { time: '11:00', textTime: '11:00' } },
  })
  .textButton({
    label: '12:00',
    payload: { date: { time: '12:00', textTime: '12:00' } },
  })
  .textButton({
    label: '13:00',
    payload: { date: { time: '13:00', textTime: '13:00' } },
  })
  .textButton({
    label: '14:00',
    payload: { date: { time: '14:00', textTime: '14:00' } },
  })

  .row()

  .textButton({
    label: '15:00',
    payload: { date: { time: '15:00', textTime: '15:00' } },
  })
  .textButton({
    label: '16:00',
    payload: { date: { time: '16:00', textTime: '16:00' } },
  })
  .textButton({
    label: '17:00',
    payload: { date: { time: '17:00', textTime: '17:00' } },
  })
  .textButton({
    label: '18:00',
    payload: { date: { time: '18:00', textTime: '18:00' } },
  })
  .textButton({
    label: '19:00',
    payload: { date: { time: '19:00', textTime: '19:00' } },
  })

  .row()
  .textButton({
    label: '20:00',
    payload: { date: { time: '20:00', textTime: '20:00' } },
  })
  .textButton({
    label: '21:00',
    payload: { date: { time: '21:00', textTime: '21:00' } },
  })
  .textButton({
    label: '22:00',
    payload: { date: { time: '22:00', textTime: '22:00' } },
  })
  .textButton({
    label: '23:00',
    payload: { date: { time: '23:00', textTime: '23:00' } },
  })
  .row()
  .textButton({
    label: `Назад`,
    color: Keyboard.NEGATIVE_COLOR,
    payload: {
      command: 'back',
    },
  });

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

const dateKeyboardGenerator = () => {
  const date = new Date();
  let day;
  let month;
  const keyboard = Keyboard.builder();

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      day = ('0' + date.getDate()).slice(-2);
      month = ('0' + (date.getMonth() + 1)).slice(-2);

      keyboard.textButton({
        label: `${day}.${month}`,
        color: Keyboard.POSITIVE_COLOR,
        payload: {
          date: {
            year: date.getFullYear().toString(),
            month: month,
            day: day,
          },
        },
      });
      date.setDate(date.getDate() + 1);
    }
    keyboard.row();
  }
  keyboard.textButton({
    label: `Отмена`,
    color: Keyboard.NEGATIVE_COLOR,
    payload: {
      command: `quit`,
    },
  });

  return keyboard;
};

const addDateKeyboard = dateKeyboardGenerator();

const addAddressKeyboard = Keyboard.builder()
  .textButton({
    label: `Штаб`,
    payload: {
      address: `Народный бульвар, 3А`,
    },
    color: Keyboard.PRIMARY_COLOR,
  })
  .row()
  .textButton({
    label: `Назад`,
    payload: {
      command: `back`,
    },
    color: Keyboard.NEGATIVE_COLOR,
  });

const previousKeyboard = Keyboard.builder().textButton({
  label: `Назад`,
  payload: {
    command: `back`,
  },
  color: Keyboard.NEGATIVE_COLOR,
});

module.exports = {
  menuKeyboard,
  addDateKeyboard,
  timeKeyboard,
  previousKeyboard,
  addAddressKeyboard,
};
