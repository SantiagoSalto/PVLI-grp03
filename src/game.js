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
import LoseScene from './scenes/LoseScene.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './Measures.js';

const WIDTH = SCREEN_WIDTH;
const HEIGHT = SCREEN_HEIGHT;

document.getElementById('game').style.aspectRatio = `${WIDTH} / ${HEIGHT}`;
document.getElementById('game').style.maxWidth = `${WIDTH}px`;   //nunca mas grande que su tamaño real

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
        AjustesScene, CreditsScene, WinScene, LevelSelector, LevelInfo, PauseScene,
    LoseScene], 
    physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { y: 0 }, 
            debug: true 
        } 
    }
};

new Phaser.Game(config);