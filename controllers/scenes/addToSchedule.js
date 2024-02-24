const {
  dateKeyboard,
  timeKeyboard,
  menuKeyboard,
  previousKeyboard,
  addAddressKeyboard,
} = require('../../utils/keyboards.js');

const { menuText, errorInputText } = require('../../utils/texts.js');

const { postNewEvent } = require('../../scripts/postNewEvent.js');

const { isValidDate, isValidTime } = require('../../utils/isValid.js');

const stepOne = async (context) => {
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Введи дату в формате ДД.ММ.ГГГГ или выбери один из вариантов на клавиатуре.

Чтобы отменить добавление нового события, напиши "Отмена", либо нажми соответствующую кнопку на клавиатуре.`,
      keyboard: dateKeyboard,
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
      message: `Введите время события в формате ЧЧ:ММ( - ЧЧ:ММ)`,
      keyboard: timeKeyboard,
    });
  }
  //выход
  if (
    /Отмена/i.test(context.text) ||
    /Назад/i.test(context.text) ||
    /back/i.test(context.text) ||
    context.messagePayload?.command == 'back'
  ) {
    return await context.scene.step.previous();
  }

  if (!context.messagePayload?.date && context.text) {
    if (!isValidTime(context.text)) {
      return await context.reply(errorInputText);
    }

    let time = context.text
      .split('-')
      .map((item) => item.trim())
      .join(' - '); // делаем одинаковые отступы 15:00 - 16:00
    const [startTime, endTime] = time.split('-').map((item) => item.trim()); // разбиваем на стартовое и конечное время
    context.scene.state.date.time = time;
    context.scene.state.date.startTime = startTime;
    context.scene.state.date.endTime = endTime ? endTime : null;
  } else {
    context.scene.state.date = {
      ...context.scene.state.date,
      ...context.messagePayload.date,
    };
  }

  return context.scene.step.next();
};

const stepThree = async (context) => {
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Введи название события (не больше 75 символов)`,
      keyboard: previousKeyboard,
    });
  }

  //выход
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

  return context.scene.step.next();
};

const stepFour = async (context) => {
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Введи место проведения (не больше 75 символов)`,
      keyboard: addAddressKeyboard,
    });
  }

  //выход
  if (
    /Отмена/i.test(context.text) ||
    /Назад/i.test(context.text) ||
    /back/i.test(context.text) ||
    context.messagePayload?.command == 'back'
  ) {
    return await context.scene.step.previous();
  }

  if (!context.messagePayload?.address && context.text) {
    if (context.text.length > 75) {
      return await context.reply(`${errorInputText}
        
        Проверь количество символов!`);
    }
    context.scene.state.address = context.text;
  } else {
    context.scene.state.address = context.messagePayload.address;
  }

  return context.scene.step.next();
};

const stepFive = async (context) => {
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Введи имя и фамилию организатора`,
      keyboard: previousKeyboard,
    });
  }

  //выход
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
  context.scene.state.organizer = context.text;

  const newEvent = context.scene.state;
  // пробрасывать ошибку?
  try {
    await postNewEvent(newEvent);
  } catch (err) {
    if (err.name == 'OverlapError') {
      return await context.send(
        'Эта дата и место уже заняты! Попробуй выбрать другие.'
      );
    }
  }

  context.send({
    message: 'Событие успешно добавлено!',
    keyboard: menuKeyboard,
  });
  return await context.scene.leave();
};

const addToScheduleScene = [stepOne, stepTwo, stepThree, stepFour, stepFive];

module.exports = {
  addToScheduleScene,
};
