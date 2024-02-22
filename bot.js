const { LONG_POLL_TOKEN, USER_TOKEN } = require('./config.js');

const { VK, API, Keyboard } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const { SessionManager } = require('@vk-io/session');

const { menuCommands } = require('./controllers/commands.js');

const sceneManager = require('./controllers/scenes/scenes.js');

const vk = new VK({
  token: LONG_POLL_TOKEN,
  apiVersion: '5.199',
});

const hearManager = new HearManager();
const sessionManager = new SessionManager();

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

hearCommand('help', [/help/i, /Помощь/i], menuCommands.help);

hearManager.onFallback(async (context) => {
  await context.send(`Такой команды нет!

  Введи /help для просмотра команд.`);
});

console.log('Started');
vk.updates.start().catch(console.error);
