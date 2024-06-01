const { menuText, errorInputText } = require('../../utils/texts');

const {
    getDateKeyboard,
    menuKeyboard,
    previousKeyboard,
} = require('../../utils/keyboards');

const { isValidDate } = require('../../utils/isValidDateTime.js');

const { deleteEvent } = require('../../scripts/deleteEvent.js');

const stepOne = async (context) => {
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Введи дату события, которое нужно удалить в формате ДД.ММ.ГГГГ или выбери один из вариантов на клавиатуре.
      
      Чтобы отменить удаление события, напиши "Отмена", либо нажми соответствующую кнопку на клавиатуре.`,
            keyboard: getDateKeyboard(),
        });
    }

  // выход
  if (
    /Отмена/i.test(context.text) ||
    /quit/i.test(context.text) ||
    context.messagePayload?.command == 'quit'
  ) {
    context.send(menuText, {
      keyboard: menuKeyboard,
    });
    return await context.scene.leave();
  }

  if (!context.messagePayload?.date && context.text) {
    if (!isValidDate(context.text)) {
      return await context.reply(errorInputText);
    }
    const [day, month, year] = context.text.split('.');
    context.scene.state.date = {
      year: year,
      month: month,
      day: day,
    };
  } else {
    context.scene.state.date = context.messagePayload.date;
  }

  return context.scene.step.next();
};

const stepTwo = async (context) => {
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Введи название удаляемого события`,
      keyboard: previousKeyboard,
    });
  }

  // выход
  if (/Отмена/i.test(context.text) || /quit/i.test(context.text)) {
    context.send(menuText, {
      keyboard: menuKeyboard,
    });
    return await context.scene.leave();
  }

  //назад
  if (
    /Отмена/i.test(context.text) ||
    /Назад/i.test(context.text) ||
    /back/i.test(context.text) ||
    context.messagePayload?.command == 'back'
  ) {
    return await context.scene.step.previous();
  }

  if (context.text.length > 75) {
    return await context.reply(`${errorInputText}
          
  Проверь количество символов!`);
  }

  context.scene.state.event = context.text;

  const eventToDelete = context.scene.state;
  try {
    await deleteEvent(eventToDelete);
  } catch (err) {
    if (err.name == 'FindEventError') {
      return await context.send(
        'Такого события нет в расписании! Мне нечего удалять :('
      );
    }
  }

  context.send({
    message: `Событие было успешно удалено из расписания!`,
    keyboard: menuKeyboard,
  });
  return await context.scene.leave();
};

const deleteFromSchedule = [stepOne, stepTwo];

module.exports = { deleteFromSchedule };
