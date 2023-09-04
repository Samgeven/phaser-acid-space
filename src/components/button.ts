type ButtonConfig = {
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  clickHandler: () => void
}

export class Button extends Phaser.GameObjects.Container {
  constructor(config: ButtonConfig) {
    const { scene, x, y, text, clickHandler } = config
    super(scene, x, y)

    const rect = scene.add.rectangle(0, 0, 120, 40, 0x37FFDB)
    const textNode = scene.add.text(0, 0, text, { fontSize: '24px' }).setOrigin(0.5)
    rect.setInteractive().on('pointerdown', () => clickHandler())

    this.add([rect, textNode])
    scene.add.existing(this)
  }
}