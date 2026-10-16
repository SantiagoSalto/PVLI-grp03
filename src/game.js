import PlayScene from './scenes/PlayScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import AjustesScene from './scenes/AjustesScene.js';
import CreditsScene from './scenes/CreditsScene.js';
import WinScene from './scenes/WinScene.js';
import LevelSelector from './scenes/LevelSelector.js';
import LevelInfo from './scenes/LevelInfo.js';
import PauseScene from './scenes/PauseScene.js';

const WIDTH = 800;
const HEIGHT = 600;

document.getElementById('game').style.aspectRatio = `${WIDTH} / ${HEIGHT}`;

let config = {
    type: Phaser.AUTO,
    parent: 'game',
    width:  WIDTH,
    height: HEIGHT,
    pixelArt: true,
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [PreloadScene, MainMenuScene, PlayScene, GameOverScene, 
        AjustesScene, CreditsScene, WinScene, LevelSelector, LevelInfo, PauseScene], 
    physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { y: 0 }, 
            debug: true 
        } 
    }
};

new Phaser.Game(config);