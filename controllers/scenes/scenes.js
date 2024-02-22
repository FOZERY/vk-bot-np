const { SceneManager, StepScene } = require('@vk-io/scenes');
const { addToScheduleScene } = require('./addToSchedule.js');

const sceneManager = new SceneManager();

sceneManager.addScenes([new StepScene('add', addToScheduleScene)]);
