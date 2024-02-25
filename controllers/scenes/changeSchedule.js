const {
  menuKeyboard,
  dateKeyboard,
  previousKeyboard,
  yesOrNotKeyboard,
  timeKeyboard,
  addAddressKeyboard,
  changeSelectKeyboard,
} = require('../../utils/keyboards');

const { menuText, errorInputText } = require('../../utils//texts');

const { isValidDate, isValidTime } = require('../../utils/isValid');

const { checkEvent } = require('../../scripts/checkEvent');
const { changeEvent } = require('../../scripts/changeEvent');

const stepOne = async (context) => {
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Введи дату события, которое нужно изменить в формате ДД.ММ.ГГГГ или выбери один из вариантов на клавиатуре.
        
Чтобы отменить изменение события, напиши "Отмена", либо нажми соответствующую кнопку на клавиатуре.`,
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
    context.scene.state.eventToChangeInfo = {
      date: { year: year, month: month, day: day },
    };
  } else {
    context.scene.state.eventToChangeInfo = {
      date: context.messagePayload.date,
    };
  }

  return context.scene.step.next();
};

const stepTwo = async (context) => {
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Введи название события, которое хочешь изменить.`,
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

  context.scene.state.eventToChangeInfo.event = context.text;
  const eventToChangeInfo = context.scene.state.eventToChangeInfo; // присваиваем в переменную для удобства

  // смотрим есть ли такое событие в расписании?
  try {
    context.scene.state.eventToChange = await checkEvent(eventToChangeInfo); // возвращает объект события или прокидывает ошибку, если события нет
    return context.scene.step.next();
  } catch (err) {
    if (err.name == 'FindEventError') {
      return await context.send('Такого события нет в расписании! :(');
    }
  }
};

const stepThree = async (context) => {
  const eventToChange = context.scene.state.eventToChange; // присваиваем в переменную для удобства

  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Событие, которое ты хочешь изменить:
Дата: ${eventToChange.date.day}.${eventToChange.date.month}.${eventToChange.date.year}
Время: ${eventToChange.date.time}
Название: ${eventToChange.event}
Место: ${eventToChange.address}
Ответственный: ${eventToChange.organizer}
          
Действительно хочешь его изменить?
          `,
      keyboard: yesOrNotKeyboard,
    });
  }

  if (
    // если хотим действительно менять событие
    context.messagePayload?.command == 'yes' ||
    /Да/i.test(context.text) ||
    /yes/i.test(context.text)
  ) {
    // делаем глубокую копию объекта события из таблицы в новое событие
    context.scene.state.newEvent = structuredClone(
      context.scene.state.eventToChange
    );
    return await context.scene.step.next(); // идём дальше
  } else if (
    // если не хотим менять - выходим на первый шаг
    context.messagePayload?.command == 'no' ||
    /Нет/i.test(context.text) ||
    /no/i.test(context.text)
  ) {
    return await context.scene.step.go(0);
  }
};

const stepFour = async (context) => {
  const newEvent = context.scene.state.newEvent;
  const eventToChange = context.scene.state.eventToChange;
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Событие на данный момент выглядит так:
Дата: ${newEvent.date.day}.${newEvent.date.month}.${newEvent.date.year}
Время: ${newEvent.date.time}
Название: ${newEvent.event}
Место: ${newEvent.address}
Ответственный: ${newEvent.organizer}
      
Что хочешь изменить?
      
1. Дату
2. Время
3. Название
4. Место
5. Организатора
6. Подтвердить`,
      keyboard: changeSelectKeyboard,
    });
  }

  if (
    context.messagePayload?.command == 'date' ||
    context.text == '1' ||
    /Дату/i.test(context.text)
  ) {
    context.scene.step.go(4);
  }
  if (
    context.messagePayload?.command == 'time' ||
    context.text == '2' ||
    /Время/i.test(context.text)
  ) {
    context.scene.step.go(5);
  }
  if (
    context.messagePayload?.command == 'event' ||
    context.text == '3' ||
    /Название/i.test(context.text)
  ) {
    context.scene.step.go(6);
  }
  if (
    context.messagePayload?.command == 'address' ||
    context.text == '4' ||
    /Место/i.test(context.text)
  ) {
    context.scene.step.go(7);
  }
  if (
    context.messagePayload?.command == 'organizer' ||
    context.text == '5' ||
    /Организатора/i.test(context.text)
  ) {
    context.scene.step.go(8);
  }
  if (
    context.messagePayload?.command == 'accept' ||
    context.text == '6' ||
    /Подтвердить/i.test(context.text)
  ) {
    try {
      await changeEvent(newEvent, eventToChange);
    } catch (err) {
      if (err.name == 'OverlapError') {
        return await context.send(
          'Эта дата и место уже заняты! Попробуй выбрать другие.'
        );
      }
      if (err.name == 'FindEventError') {
        return await context.send('Ошибка! Не могу найти такое событие...');
      }
    }

    context.send({
      message: 'Событие успешно изменено!',
      keyboard: menuKeyboard,
    });
    return await context.scene.leave();
  }
};

const stepDate = async (context) => {
  if (context.scene.step.firstTime || !context.text) {
    return await context.send({
      message: `Введи дату в формате ДД.ММ.ГГГГ или выбери один из вариантов на клавиатуре.

Чтобы отменить изменение нового события, напиши "Отмена", либо нажми соответствующую кнопку на клавиатуре.`,
      keyboard: dateKeyboard,
    });
  }

  // выход
  if (
    /Отмена/i.test(context.text) ||
    /quit/i.test(context.text) ||
    /Назад/i.test(context.text) ||
    context.messagePayload?.command == 'quit'
  ) {
    return await context.scene.step.go(3); // назад
  }

  if (!context.messagePayload?.date && context.text) {
    if (!isValidDate(context.text)) {
      return await context.reply(errorInputText);
    }
    const [day, month, year] = context.text.split('.');
    context.scene.state.newEvent.date = {
      ...context.scene.state.newEvent.date,
      year: year,
      month: month,
      day: day,
    };
  } else {
    context.scene.state.newEvent.date = {
      ...context.scene.state.newEvent.date,
      ...context.messagePayload.date,
    };
  }

  return context.scene.step.go(3);
};

const stepTime = async (context) => {
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
    return await context.scene.step.go(3);
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
    context.scene.state.newEvent.date.time = time;
    context.scene.state.newEvent.date.startTime = startTime;
    context.scene.state.newEvent.date.endTime = endTime ? endTime : null;
  } else {
    context.scene.state.newEvent.date = {
      ...context.scene.state.newEvent.date,
      ...context.messagePayload.date,
    };
  }

  return context.scene.step.go(3);
};

const stepName = async (context) => {
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
    return await context.scene.step.go(3);
  }

  if (context.text.length > 75) {
    return await context.reply(`${errorInputText}
        
Проверь количество символов!`);
  }

  context.scene.state.newEvent.event = context.text;

  return context.scene.step.go(3);
};

const stepAddress = async (context) => {
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
    return await context.scene.step.go(3);
  }

  if (!context.messagePayload?.address && context.text) {
    if (context.text.length > 75) {
      return await context.reply(`${errorInputText}
        
        Проверь количество символов!`);
    }
    context.scene.state.newEvent.address = context.text;
  } else {
    context.scene.state.newEvent.address = context.messagePayload.address;
  }

  return context.scene.step.go(3);
};

const stepOrganizer = async (context) => {
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
    return await context.scene.step.go(3);
  }

  if (context.text.length > 75) {
    return await context.reply(`${errorInputText}
        
Проверь количество символов!`);
  }
  context.scene.state.newEvent.organizer = context.text;

  return context.scene.step.go(3);
};

const changeSchedule = [
  stepOne,
  stepTwo,
  stepThree,
  stepFour,
  stepDate,
  stepTime,
  stepName,
  stepAddress,
  stepOrganizer,
];

module.exports = { changeSchedule };
