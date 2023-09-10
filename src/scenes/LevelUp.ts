import { Modal } from "../components/ui/modal"
import { Skillset } from "../components/ui/skillset"

export class LevelUp extends Phaser.Scene {
  modal?: Phaser.GameObjects.Container

  constructor() {
    super('level-up')
  }

  preload() {
    this.load.image('peagun', 'assets/weapons/peagun.svg');
  }

  create() {
    const modal = new Modal({
      scene: this,
      width: 800,
      height: 500,
    })

    const top = modal.box.height / 2 - modal.box.height + 40

    const title = this.add.text(0, top, 'Level up!', { fontSize: '40px', fontFamily: 'Arial' }).setOrigin(0.5)
    const subtitle = this.add.text(0, top + 52, 'Choose upgrade', { fontSize: '28px', fontFamily: 'Arial' }).setOrigin(0.5)
    const skillSet = new Skillset({
      scene: this,
      x: 0,
      y: top + 140,
      skills: ['Alacrity', 'Speed', 'Robust']
    })

    skillSet.setX(-skillSet.width / 2)

    modal.add([title, subtitle, skillSet])
    this.modal = modal

    this.add.tween({
      targets: modal,
      scale: { from: 3, to: 1 },
      duration: 400,
      alpha: { from: 0.4, to: 1 }
    })
  }

  continueGame() {
    this.add.tween({
      targets: this.modal,
      scale: { from: 1, to: 3 },
      duration: 400,
      alpha: { from: 1, to: 0.4 },
      onComplete: () => {
        this.scene.stop('level-up')
        this.scene.run('GameScene')
      }
    })
  }
}