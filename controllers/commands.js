const { menuKeyboard } = require('../utils/keyboards.js');

const menuCommands = {
  menu: async function (context) {
    await context.send({
      message: 'Используйте клавиатуру',
      keyboard: menuKeyboard,
    });
  },

  add: async function (context) {
    await context.scene.enter('add');
  },
};

module.exports = {
  menuCommands,
};
