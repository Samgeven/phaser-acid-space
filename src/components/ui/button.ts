const STYLE_PRESETS = Object.freeze({
  SM: {
    PAD_X: 32,
    PAD_Y: 16,
    FONT_SIZE: '24px'
  },
  LG: {
    PAD_X: 48,
    PAD_Y: 24,
    FONT_SIZE: '32px'
  }
})

type ButtonConfig = {
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  clickHandler: () => void
  style?: keyof typeof STYLE_PRESETS
}

export class Button extends Phaser.GameObjects.Container {
  constructor(config: ButtonConfig) {
    const { scene, x, y, text, clickHandler, style = 'SM' } = config
    const { PAD_X, PAD_Y, FONT_SIZE } = STYLE_PRESETS[style]
    super(scene, x, y)

    const textNode = scene.add.text(0, 0, text, { fontSize: FONT_SIZE, fontFamily: 'Arial' }).setOrigin(0.5)
    const rect = scene.add.rectangle(0, 0, textNode.width + PAD_X, textNode.height + PAD_Y, 0xFF3688)

    rect.setInteractive()
      .on('pointerdown', () => clickHandler())
      .on('pointerover', () => {
        scene.tweens.add({
          targets: this,
          alpha: 0.7,
          duration: 300,
          yoyo: true
        })
      })

    this.add([rect, textNode])
    scene.add.existing(this)
  }
}