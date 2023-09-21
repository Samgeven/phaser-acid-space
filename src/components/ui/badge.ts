type BadgeConfig = {
  scene: Phaser.Scene
  x: number
  y: number
  text: string
  color: number
}

export class Badge extends Phaser.GameObjects.Container {
  constructor(config: BadgeConfig) {
    const { scene, x, y, text, color } = config
    super(scene, x, y)

    const textNode = scene.add.text(0, 0, text, { fontSize: '20px', fontFamily: 'Arial' }).setOrigin(0.5)
    const rect = scene.add.rectangle(0, 0, textNode.width + 20, textNode.height + 4, color).setAlpha(0.7)

    this.add([rect, textNode])
    scene.add.existing(this)
  }
}
