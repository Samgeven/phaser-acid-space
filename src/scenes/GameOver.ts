import { Button } from "../components/button"

export class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over')
  }

  create() {
    this.add.rectangle(this.game.scale.width / 2, this.game.scale.height / 2, 400, 300, 0x090909)
    this.add.text(this.game.scale.width / 2, this.game.scale.height / 2, 'Game over!', {fontSize: '32px'}).setOrigin(0.5)
    new Button({
      scene: this,
      x: this.game.scale.width / 2,
      y: this.game.scale.height / 2 + 80,
      text: 'Restart',
      clickHandler: () => this.scene.start('GameScene')
    })
  }
}