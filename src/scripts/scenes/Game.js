import Phaser from 'phaser'
import Carrot from '../objects/carrot'

export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors

  /** @type {Phaser.Physics.Arcade.Group} */
  carrots

  constructor() {
    super('game')
  }
  preload() {
    this.load.image('background', '../../assets/img/bg_layer1.png')
    this.load.image('platform', '../../assets/img/ground_grass.png')
    this.load.image('bunny-stand', '../../assets/img/bunny1_stand.png')
    this.load.image('bunny-jump', '../../assets/img/bunny1_jump.png')
    this.cursors = this.input.keyboard.createCursorKeys()
    this.load.image('carrot', '../../assets/img/carrot.png')
  }

  create() {
    this.add.image(240, 320, 'background').setScrollFactor(1, 0)

    this.platforms = this.physics.add.staticGroup()
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400)
      const y = 150 * i

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, 'platform')
      platform.scale = 0.5

      /** @type {Phaser.Physics.Arcade.StaticBody} */

      const body = platform.body
      body.updateFromGameObject()
    }
    this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)
    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.right = false
    this.player.body.checkCollision.left = false

    this.physics.add.collider(this.platforms, this.player)
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setDeadzone(this.scale.width * 1.5)

    this.carrots = this.physics.add.group({ classType: Carrot })
    this.carrots.get(240, 320, 'carrot')
    this.physics.add.collider(this.platforms, this.carrots)
  }
  update(t, dt) {
    const touchingDown = this.player.body.touching.down

    this.horizontalWrap(this.player)

    if (touchingDown) {
      this.player.setVelocityY(-300)
    }

    this.platforms.children.iterate(child => {
      const platform = child
      const scrollY = this.cameras.main.scrollY

      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100)
        platform.body.updateFromGameObject()
        this.addCarrotAbove(platform)
      }
    })

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200)
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200)
    } else {
      this.player.setVelocityX(0)
    }
  }
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5
    const gameWidth = this.scale.width
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth
    }
  }

  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, 'carrot')
    this.add.existing(carrot)
    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height)
    return carrot
  }
}
