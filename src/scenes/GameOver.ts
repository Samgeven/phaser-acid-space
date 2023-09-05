import { Button } from "../components/ui/button"

type Stats = {
  timePassed: number, 
  enemiesKilled: number
}
export class GameOver extends Phaser.Scene {
  stats: Stats = {
    timePassed: 0,
    enemiesKilled: 0
  }

  constructor() {
    super('game-over')
  }

  init(data: Stats) {
    this.stats = data
  }

  create() {
    const wrap = this.add.container(this.game.scale.width / 2, this.game.scale.height / 2)
    const rect = this.add.rectangle(0, 0, 400, 300, 0x464e93)
    const title = this.add.text(0, -100, 'Game over!', {fontSize: '36px', fontFamily: 'Arial'}).setOrigin(0.5)

    const time = new Date(Date.now() - this.stats.timePassed)

    const enemyScore = this.add.text(
      wrap.width / 2 - 100, -60, 
      `Enemies killed: ${this.stats?.enemiesKilled}`, 
      {fontSize: '24px', fontFamily: 'Arial', align: 'left'}
    )
    const timeScore = this.add.text(
      wrap.width / 2 - 100, -28,
      `Time survived: ${time.getMinutes()}:${time.getSeconds()}`, 
      {fontSize: '24px', fontFamily: 'Arial', align: 'left'}
    )

    const button = new Button({
      scene: this,
      x: 0,
      y: 100,
      text: 'Restart',
      clickHandler: () => this.scene.start('GameScene'),
    })

    wrap.add([rect, title, button, enemyScore, timeScore])

    this.add.tween({
      targets: wrap,
      scale: { from: 3, to: 1 },
      duration: 400,
      alpha: { from: 0.4, to: 1 }
    })
  }
}