import { Enemy } from './enemy'

export class EnemyGenerator {
  scene: Phaser.Scene
  spawnTimer: Phaser.Time.TimerEvent | null
  spawnInterval: number
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.spawnTimer = null
    this.spawnInterval = 2000 // Spawn interval in milliseconds
  }

  start() {
    this.spawnTimer = this.scene.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    })
  }

  stop() {
    if (this.spawnTimer) {
      this.spawnTimer.destroy()
      this.spawnTimer = null
      this.scene.children.getByName('spawn-light')?.destroy()
    }
  }

  spawnEnemy() {
    // Generate random coordinates for the enemy
    const screenWidth = this.scene.game.scale.width
    const screenHeight = this.scene.game.scale.height

    // Generate random coordinates for the enemy outside the screen
    const spawnSide = Phaser.Math.Between(0, 3) // Randomly select a side of the screen

    let x: number, y: number
    switch (spawnSide) {
      case 0: // Top side
        x = Phaser.Math.Between(0, screenWidth)
        y = -50
        break
      case 1: // Right side
        x = screenWidth + 50
        y = Phaser.Math.Between(0, screenHeight)
        break
      case 2: // Bottom side
        x = Phaser.Math.Between(0, screenWidth)
        y = screenHeight + 50
        break
      case 3: // Left side
        x = -50
        y = Phaser.Math.Between(0, screenHeight)
        break
      default:
        x = 0
        y = 0
    }

    const light = this.scene.add.pointlight(x, y, 0x00ff00, 30).setAlpha(0.15).setName('spawn-light')

    this.scene.tweens.add({
      targets: light,
      duration: 1500,
      hold: 1000,
      yoyo: true,
      radius: 150,
      onYoyo: () => {
        new Enemy(this.scene, x, y)
      },
      onComplete: () => {
        light?.destroy()
      },
    })
  }
}
