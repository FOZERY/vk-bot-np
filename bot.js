const { LONG_POLL_TOKEN, USER_TOKEN } = require('./config.js');

const { VK, API, Keyboard } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const { SessionManager } = require('@vk-io/session');
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

vk.updates.on(['message_new', 'message_event'], [sessionManager.middleware]);

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

hearManager.onFallback(async (context) => {
  await context.send(`Такой команды нет!

  Введите /help для просмотра команд.`);
});

console.log('Started');
vk.updates.start().catch(console.error);

const startKeyboard = Keyboard.builder()
  .textButton({
    label: 'Добавить в расписание',
    payload: {
      command: 'add',
    },
    color: Keyboard.POSITIVE_COLOR,
  })
  .row()
  .textButton({
    label: 'Изменить расписание',
    payload: {
      command: 'change',
    },
    color: Keyboard.PRIMARY_COLOR,
  })
  .row()
  .textButton({
    label: 'Удалить из расписания',
    payload: {
      command: 'delete',
    },
    color: Keyboard.NEGATIVE_COLOR,
  });

const addKeyboard = Keyboard.builder()
  .callbackButton({
    label: '01.02',
    payload: {
      command: 'add',
    },
    color: Keyboard.POSITIVE_COLOR,
  })
  .callbackButton({
    label: '02.02',
    payload: {
      command: 'add',
    },
    color: Keyboard.POSITIVE_COLOR,
  })
  .callbackButton({
    label: '03.02',
    payload: {
      command: 'add',
    },
    color: Keyboard.POSITIVE_COLOR,
  })
  .callbackButton({
    label: '04.02',
    payload: {
      command: 'add',
    },
    color: Keyboard.POSITIVE_COLOR,
  })
  .callbackButton({
    label: '05.02',
    payload: {
      command: 'add',
    },
    color: Keyboard.POSITIVE_COLOR,
  })
  .row()
  .callbackButton({
    label: '06.02',
    payload: {
      command: 'add',
    },
    color: Keyboard.POSITIVE_COLOR,
  })
  .callbackButton({
    label: '07.02',
    payload: {
      command: 'add',
    },
    color: Keyboard.POSITIVE_COLOR,
  })
  .row();

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
