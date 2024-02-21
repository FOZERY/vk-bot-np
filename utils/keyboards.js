const { Keyboard } = require('vk-io');

const timeKeyboard = Keyboard.builder()
  .textButton({
    label: '00:00',
    payload: { date: { time: '00:00', startTime: '00:00', endTime: null } },
  })
  .textButton({
    label: '01:00',
    payload: { date: { time: '01:00', startTime: '01:00' } },
  })
  .textButton({
    label: '02:00',
    payload: { date: { time: '02:00', startTime: '02:00', endTime: null } },
  })
  .textButton({
    label: '03:00',
    payload: { date: { time: '03:00', startTime: '03:00', endTime: null } },
  })
  .textButton({
    label: '04:00',
    payload: { date: { time: '04:00', startTime: '04:00', endTime: null } },
  })

  .row()

  .textButton({
    label: '05:00',
    payload: { date: { time: '05:00', startTime: '05:00', endTime: null } },
  })
  .textButton({
    label: '06:00',
    payload: { date: { time: '06:00', startTime: '06:00', endTime: null } },
  })
  .textButton({
    label: '07:00',
    payload: { date: { time: '07:00', startTime: '07:00', endTime: null } },
  })
  .textButton({
    label: '08:00',
    payload: { date: { time: '08:00', startTime: '08:00', endTime: null } },
  })
  .textButton({
    label: '09:00',
    payload: { date: { time: '09:00', startTime: '09:00', endTime: null } },
  })

  .row()

  .textButton({
    label: '10:00',
    payload: { date: { time: '10:00', startTime: '10:00', endTime: null } },
  })
  .textButton({
    label: '11:00',
    payload: { date: { time: '11:00', startTime: '11:00', endTime: null } },
  })
  .textButton({
    label: '12:00',
    payload: { date: { time: '12:00', startTime: '12:00', endTime: null } },
  })
  .textButton({
    label: '13:00',
    payload: { date: { time: '13:00', startTime: '13:00', endTime: null } },
  })
  .textButton({
    label: '14:00',
    payload: { date: { time: '14:00', startTime: '14:00', endTime: null } },
  })

  .row()

  .textButton({
    label: '15:00',
    payload: { date: { time: '15:00', startTime: '15:00', endTime: null } },
  })
  .textButton({
    label: '16:00',
    payload: { date: { time: '16:00', startTime: '16:00', endTime: null } },
  })
  .textButton({
    label: '17:00',
    payload: { date: { time: '17:00', startTime: '17:00', endTime: null } },
  })
  .textButton({
    label: '18:00',
    payload: { date: { time: '18:00', startTime: '18:00', endTime: null } },
  })
  .textButton({
    label: '19:00',
    payload: { date: { time: '19:00', startTime: '19:00', endTime: null } },
  })

  .row()
  .textButton({
    label: '20:00',
    payload: { date: { time: '20:00', startTime: '20:00', endTime: null } },
  })
  .textButton({
    label: '21:00',
    payload: { date: { time: '21:00', startTime: '21:00', endTime: null } },
  })
  .textButton({
    label: '22:00',
    payload: { date: { time: '22:00', startTime: '22:00', endTime: null } },
  })
  .textButton({
    label: '23:00',
    payload: { date: { time: '23:00', startTime: '23:00', endTime: null } },
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
