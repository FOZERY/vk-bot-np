const { menuKeyboard } = require('../utils/keyboards.js');
const { startText, helpText } = require('../utils/texts.js');

const menuCommands = {
  menu: async function (context) {
    await context.send({
      message: startText,
      keyboard: menuKeyboard,
    });
  },

  add: async function (context) {
    await context.scene.enter('add');
  },

  help: async function (context) {
    await context.send({
      message: helpText,
      keyboard: menuKeyboard,
    });
  },
};

module.exports = {
  menuCommands,
};
