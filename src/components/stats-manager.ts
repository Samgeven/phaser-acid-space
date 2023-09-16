export class StatsManager {
  scene: Phaser.Scene
  enemyKillCount: number = 0
  timePassed: number = Date.now()

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  getStats() {
    return {
      timePassed: this.timePassed,
      enemiesKilled: this.enemyKillCount,
    }
  }
}
