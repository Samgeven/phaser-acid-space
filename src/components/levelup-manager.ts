type Ability = {
  title: string
  ranks: number[]
  description: string
  icon: string
}

export class LevelUpManager {
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }
}
