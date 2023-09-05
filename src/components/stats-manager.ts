export class StatsManager {
  scene: Phaser.Scene
  enemyKillCount: number = 0
  timePassed: number = Date.now()

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.bindEvents()
  }

  bindEvents() {
    this.scene.events.on('enemy-killed', () => this.enemyKillCount += 1)
  }

  getStats() {
    return {
      timePassed: this.timePassed,
      enemiesKilled: this.enemyKillCount
    }
  }
}