import Phaser from 'phaser'

export default class Carrot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture)
  }

  preload() {
    this.load.image('carrot', '../../assets/img/carrot.png')
  }
}
