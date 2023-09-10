type ModalConfig = {
  scene: Phaser.Scene,
  width?: number,
  height?: number,
}

export class Modal extends Phaser.GameObjects.Container {
  box: Phaser.GameObjects.Rectangle

  constructor(config: ModalConfig) {
    const { scene, width = 400, height = 300 } = config
    super(scene, scene.game.scale.width / 2, scene.game.scale.height / 2)
    this.box = scene.add.rectangle(0, 0, width, height, 0x302554)

    this.add(this.box)
    scene.add.existing(this)
  }
}