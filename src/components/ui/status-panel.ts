import Main from '../../scenes/Main'

export class StatusPanel extends Phaser.GameObjects.Container {
  hpChunks: Phaser.GameObjects.Image[] = []
  maxExp: number = 100
  currentExp: number = 0
  levelBar: Phaser.GameObjects.Rectangle
  levelFill: Phaser.GameObjects.Rectangle
  levelCount: number = 1
  levelText: Phaser.GameObjects.Text

  constructor(scene: Main, hp: number) {
    super(scene, 80, 80)

    const levelIcon = scene.add.image(0, 0, 'level-icon')
    const levelCounter = scene.add.text(0, 0, '1', { fontSize: '44px', fontFamily: 'arial' }).setOrigin(0.5)
    this.levelText = levelCounter

    const levelBar = scene.add.rectangle(48, -40, 400, 5, 0xffffff).setOrigin(0)
    const levelBarFilled = scene.add
      .rectangle(48, -40, (levelBar.width / 100) * this.currentExp, 5, 0x00c6bb)
      .setOrigin(0)
    this.levelFill = levelBarFilled
    this.levelBar = levelBar

    for (let i = 1; i <= hp; i++) {
      const chunk = scene.add.image(120 + i * 24, 64, 'hp-chunk')
      this.hpChunks = [...this.hpChunks, chunk]
    }

    this.add([levelIcon, levelCounter, levelBar, levelBarFilled])
    scene.add.existing(this)
  }

  decreaseHp() {
    const lastChunk = this.hpChunks.pop()
    this.scene.tweens.add({
      targets: lastChunk,
      scale: 2,
      alpha: 0,
      duration: 600,
      onComplete: () => {
        lastChunk?.destroy()
      },
    })
  }

  gainExp(value: number) {
    this.currentExp += value

    if (this.maxExp <= this.currentExp) {
      this.currentExp = this.currentExp - this.maxExp
      this.levelFill.width = (this.levelBar.width / 100) * this.currentExp
      this.scene.events.emit('level-up')
      return
    }

    this.levelFill.width = (this.levelBar.width / 100) * this.currentExp
  }

  gainLevel() {
    this.levelCount += 1
    this.levelText.setText(String(this.levelCount))
  }
}
