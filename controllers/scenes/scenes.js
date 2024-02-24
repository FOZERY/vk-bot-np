const { SceneManager, StepScene } = require('@vk-io/scenes');
const { addToScheduleScene } = require('./addToSchedule.js');
const { deleteFromSchedule } = require('./deleteFromSchedule.js');
const { changeSchedule } = require('./changeSchedule.js');

const sceneManager = new SceneManager();

sceneManager.addScenes([
  new StepScene('add', addToScheduleScene),
  new StepScene('delete', deleteFromSchedule),
  new StepScene('change', changeSchedule),
]);

module.exports = sceneManager;
