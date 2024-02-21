const { LONG_POLL_TOKEN, USER_TOKEN } = require('./config.js');

const { VK, API, Keyboard } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const { SessionManager } = require('@vk-io/session');
const { SceneManager, StepScene } = require('@vk-io/scenes');

const {
  addDateKeyboard,
  timeKeyboard,
  menuKeyboard,
  previousKeyboard,
  addAddressKeyboard,
} = require('./utils/keyboards.js');
const { menuCommands } = require('./controllers/commands.js');
const { isValidDate } = require('./utils/isValidDate.js');
const { isValidTime } = require('./utils/isValidTime.js');

const { postNewEvent } = require('./script.js');

const { menuText, errorInputText } = require('./utils/texts.js');

const vk = new VK({
  token: LONG_POLL_TOKEN,
  apiVersion: '5.199',
});

const hearManager = new HearManager();
const sessionManager = new SessionManager();
const sceneManager = new SceneManager();

vk.updates.on(
  ['message_new', 'message_event'],
  [
    sessionManager.middleware,
    sceneManager.middleware,
    sceneManager.middlewareIntercept,
  ]
);

vk.updates.on('message_new', async (context, next) => {
  if (context.isChat || context.isOutbox) {
    return;
  }
  const { messagePayload } = context;

  context.state.command =
    messagePayload && messagePayload.command ? messagePayload.command : null;

  return next();
});

vk.updates.on('message_new', hearManager.middleware);

// hearCommand wrapper (для использования одной команды для кнопки и текста)
const hearCommand = (name, conditions, handle) => {
  if (typeof handle !== 'function') {
    handle = conditions;
    conditions = [`/${name}`];
  }
  if (!Array.isArray(conditions)) {
    conditions = [conditions];
  }

  hearManager.hear(
    [(text, { state }) => state.command === name, ...conditions],
    handle
  );
};

hearCommand('start', [/Старт/i, /Начать/i, /start/i], menuCommands.menu);
hearCommand(
  'add',
  [/Добавить/i, /Добавить в расписание/i, /Внести/i, /add/i],
  menuCommands.add
);

sceneManager.addScenes([
  new StepScene('add', [
    async (context) => {
      if (context.scene.step.firstTime || !context.text) {
        return await context.send({
          message: `Введи дату в формате ДД.ММ.ГГГГ

Чтобы отменить добавление нового события, напиши Отмена, либо нажми кнопку`,
          keyboard: addDateKeyboard,
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
    },
    async (context) => {
      if (context.scene.step.firstTime || !context.text) {
        return await context.send({
          message: `Введите время в формате ЧЧ:ММ`,
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
    },
    async (context) => {
      if (context.scene.step.firstTime || !context.text) {
        console.log(context.scene.state.date);
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
    },
    async (context) => {
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
    },
    async (context) => {
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
        message: menuText,
        keyboard: menuKeyboard,
      });
      return await context.scene.leave();
    },
  ]),
]);

hearManager.onFallback(async (context) => {
  await context.send(`Такой команды нет!

  Введи /help для просмотра команд.`);
});

console.log('Started');
vk.updates.start().catch(console.error);
