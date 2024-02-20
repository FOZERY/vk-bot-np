const { LONG_POLL_TOKEN, USER_TOKEN } = require('./config.js');

const { VK, API, Keyboard } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const { SessionManager } = require('@vk-io/session');
const { SceneManager, StepScene } = require('@vk-io/scenes');

const {
  addDateKeyboard,
  timeKeyboard,
  menuKeyboard,
} = require('./utils/keyboards.js');

const { menuCommands } = require('./controllers/commands.js');

const vk = new VK({
  token: LONG_POLL_TOKEN,
  apiVersion: '5.199',
});
const api = new API({
  token: USER_TOKEN,
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

hearCommand('add', menuCommands.add);

sceneManager.addScenes([
  new StepScene('add', [
    async (context) => {
      if (context.scene.step.firstTime || !context.text) {
        return context.send({
          message: `Введите дату в формате ДД.ММ.ГГГГ`,
          keyboard: addDateKeyboard,
        });
      }

      if (!context.messagePayload) {
        const [day, month, year] = context.text.split('.');
        context.scene.state.date = {
          year: year,
          month: month,
          day: day,
        };
      } else {
        context.scene.state.date = context.messagePayload.date;
      }
      console.log(context.scene.state.date);
      await context.scene.leave();
      return context.send({
        message: `Используйте клавиатуру`,
        keyboard: menuKeyboard,
      });
    },
    (context) => {
      return context.send({
        message: `Введите время в формате ЧЧ:ММ`,
        keyboard: timeKeyboard,
      });
      context.scene.state.date.time = context.text;
    },
  ]),
]);

hearManager.onFallback(async (context) => {
  await context.send(`Такой команды нет!

  Введите /help для просмотра команд.`);
});

console.log('Started');
vk.updates.start().catch(console.error);

/*
  // hear wrapper
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

hearCommand('help', [/help/i, /помощь/i], async (context) => {
  await context.send(`
  Мои команды:

  /start - начать
  /help - помощь
  /add - добавить в расписание
  /change - изменить событие
  /delete - удалить из расписания
`);
});

hearCommand('start', [/start/i, /начать/i, /старт/i], async (context) => {
  await context.send({
    message: `
    Привет! 
    
    Я бот для редактирования расписания группы Нового Поколения.

    Используй кнопки для дальнейших действий, либо воспользуйся одной из команд.
    
    Чтобы увидеть список команд используй /help.
    `,
    keyboard: startKeyboard,
  });
});

hearCommand('add', ['/add'], async (context) => {
  await context.send({
    message: 'Выберите или введите дату',
    keyboard: addKeyboard,
  });
});
*/
