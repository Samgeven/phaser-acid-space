import { LevelUp } from "../../scenes/LevelUp"

type SkillsetConfig = {
  scene: LevelUp,
  x: number,
  y: number,
  skills: string[]
}

export class Skillset extends Phaser.GameObjects.Container {
  constructor(config: SkillsetConfig) {
    const { scene, x, y, skills } = config
    super(scene, x, y)

    const baseWidth = 150
    const padding = 80

    skills.forEach((el, i) => {
      const x = baseWidth * i + padding * i
      this.addSkill(el, x, 0)
    })

    this.setSize(baseWidth * skills.length + padding * (skills.length - 1), 150)
    scene.add.existing(this)
    this.scene = scene
  }

  addSkill(key: string, x: number, y: number) {
    const skillWrap = this.scene.add.container(x, y).setName(key)
    const icon = this.scene.add.image(0, 0, 'peagun').setOrigin(0)
    const text = this.scene.add.text(0, -32, key, { fontSize: '24px', fontFamily: 'Arial' }).setOrigin(0, 0)

    skillWrap.add([icon, text])
    this.scene.add.existing(skillWrap)
    this.add(skillWrap)

    icon.setInteractive().on('pointerdown', () => {
      const scene = this.scene as LevelUp
      scene.continueGame()
    })
  }
}