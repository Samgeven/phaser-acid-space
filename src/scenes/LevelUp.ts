import { Modal } from '../components/ui/modal'
import { Skillset } from '../components/ui/skillset'
import { SKILLS } from '../data/skills'
import Main from './Main'

export class LevelUp extends Phaser.Scene {
  modal?: Phaser.GameObjects.Container
  skillset: Array<keyof typeof SKILLS> = []

  constructor() {
    super('level-up')
  }

  init(skillset: { skills: Array<keyof typeof SKILLS> }) {
    this.skillset = skillset.skills
  }

  preload() {
    this.skillset.forEach(el => {
      this.load.image(el, `assets/skills/${el}.svg`)
    })
  }

  create() {
    const modal = new Modal({
      scene: this,
      width: 900,
      height: 560,
    })

    const top = modal.box.height / 2 - modal.box.height + 60

    const title = this.add.text(0, top, 'Level up!', { fontSize: '40px', fontFamily: 'Arial' }).setOrigin(0.5)
    const subtitle = this.add
      .text(0, top + 52, 'Choose upgrade', { fontSize: '28px', fontFamily: 'Arial' })
      .setOrigin(0.5)
    const skillSet = new Skillset({
      scene: this,
      x: 0,
      y: top + 140,
      skills: this.skillset ?? [],
    })

    skillSet.setX(-skillSet.width / 2)

    modal.add([title, subtitle, skillSet])
    this.modal = modal

    this.add.tween({
      targets: modal,
      scale: { from: 3, to: 1 },
      duration: 400,
      alpha: { from: 0.4, to: 1 },
    })
  }

  continueGame(skillKey: keyof typeof SKILLS) {
    this.add.tween({
      targets: this.modal,
      scale: { from: 1, to: 3 },
      duration: 400,
      alpha: { from: 1, to: 0.4 },
      onComplete: () => {
        const mainScene = this.scene.get('GameScene') as Main
        mainScene.ball?.skills.push(skillKey)
        mainScene.levelUpManager?.updateBallStats(skillKey)
        this.scene.stop('level-up')
        this.scene.run('GameScene')
      },
    })
  }
}
