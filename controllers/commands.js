const { menuKeyboard } = require('../utils/keyboards.js');

const menuCommands = {
  menu: async function (context) {
    await context.send({
      message: 'Используйте клавиатуру',
      keyboard: menuKeyboard,
    });
  },

  add: async function (context) {
    await context.send('add ');
  },
};

module.exports = {
  menuCommands,
};
