import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import Game from './scenes/Game'
import GameOver from './scenes/GameOver'

const DEFAULT_WIDTH = 480
const DEFAULT_HEIGHT = 640

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 200 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
