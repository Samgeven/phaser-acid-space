import { Button } from '../components/ui/button'
import { Modal } from '../components/ui/modal'

type Stats = {
  timePassed: number
  enemiesKilled: number
}
export class GameOver extends Phaser.Scene {
  stats: Stats = {
    timePassed: 0,
    enemiesKilled: 0,
  }

  constructor() {
    super('game-over')
  }

  init(data: Stats) {
    this.stats = data
  }

  create() {
    const modal = new Modal({
      scene: this,
    })
    const title = this.add.text(0, -100, 'Game over!', { fontSize: '36px', fontFamily: 'Arial' }).setOrigin(0.5)

    const time = new Date(Date.now() - this.stats.timePassed)

    const enemyScore = this.add.text(modal.width / 2 - 100, -60, `Enemies killed: ${this.stats?.enemiesKilled}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      align: 'left',
    })
    const timeScore = this.add.text(
      modal.width / 2 - 100,
      -28,
      `Time survived: ${time.getMinutes()}:${time.getSeconds()}`,
      { fontSize: '24px', fontFamily: 'Arial', align: 'left' }
    )

    const button = new Button({
      scene: this,
      x: 0,
      y: 100,
      text: 'Restart',
      clickHandler: () => this.scene.start('GameScene'),
    })

    modal.add([title, button, enemyScore, timeScore])

    this.add.tween({
      targets: modal,
      scale: { from: 3, to: 1 },
      duration: 400,
      alpha: { from: 0.4, to: 1 },
    })
  }
}
