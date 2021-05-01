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

  carrotsCollected

  carrotsCollectedText

  constructor() {
    super('game')
  }

  init() {
    this.carrotsCollected = 0
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
    this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this)
    this.physics.add.collider(this.platforms, this.carrots)

    const style = { color: '#000', fontSize: 24 }
    this.carrotsCollectedText = this.add.text(240, 10, 'Carrots: 0', style).setScrollFactor(0).setOrigin(0.5, 0)
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

      const bottomPlatform = this.findBottomMostPlatform()
      if (this.player.y > bottomPlatform.y + 200) {
        this.scene.start('game-over')
      }
    })

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200)
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(-200)
    } else {
      this.player.setVelocityX(0)
    }

    var pointer = this.input.activePointer
    // if (pointer.isDown) {
    //   var touchX = pointer.x
    //   var touchY = pointer.y
    //   console.log(touchX, touchY)
    //   this.physics.moveTo(this.player, pointer, touchX)
    // }

    if (pointer.x < this.player.x) {
      // mouse pointer is to the left
      if (pointer.isDown) {
        this.player.setVelocityX(-200)
        console.log('click to the left')
      }
    } else if (pointer.x > this.player.x) {
      if (pointer.isDown) {
        this.player.setVelocityX(200)
        console.log('click to the right')
      }

      // mouse pointer is to the right  }
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

    carrot.setActive(true)
    carrot.setVisible(true)
    this.add.existing(carrot)
    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height)

    this.physics.world.enable(carrot)
    return carrot
  }

  handleCollectCarrot(player, carrot) {
    console.log('collect carot')
    this.carrots.killAndHide(carrot)
    this.physics.world.disableBody(carrot.body)
    this.carrotsCollected++
    const value = `Carrots: ${this.carrotsCollected}`
    this.carrotsCollectedText.text = value
  }

  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren()
    let bottomPlatform = platforms[0]

    for (let i = 1; i < platforms.length; ++i) {
      const platform = platforms[i]

      if (platform.y < bottomPlatform.y) {
        continue
      }

      bottomPlatform = platform
    }

    return bottomPlatform
  }
}
