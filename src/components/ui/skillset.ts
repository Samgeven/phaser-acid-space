import { LevelUp } from '../../scenes/LevelUp'
import { SKILLS, TYPE_TO_COLOR_MAP } from '../../data/skills'
import { Badge } from './badge'
import Main from '../../scenes/Main'

type SkillsetConfig = {
  scene: LevelUp
  x: number
  y: number
  skills: Array<keyof typeof SKILLS>
}

export class Skillset extends Phaser.GameObjects.Container {
  constructor(config: SkillsetConfig) {
    const { scene, x, y, skills } = config
    super(scene, x, y)

    const baseWidth = 150
    const padding = 110

    skills.forEach((el, i) => {
      const x = baseWidth * i + padding * i
      this.addSkill(el, x, 0)
    })

    this.setSize(baseWidth * skills.length + padding * (skills.length - 1), 150)
    scene.add.existing(this)
    this.scene = scene
  }

  getCurrentSkillsList() {
    const mainScene = this.scene.scene.get('GameScene') as Main
    return mainScene.ball?.skills ?? []
  }

  defineSkillRank(key: keyof typeof SKILLS) {
    if (SKILLS[key].ranks.length === 0) {
      return '∞'
    }
    const currentSkills = this.getCurrentSkillsList()
    return `lvl ${currentSkills.filter((el) => el === key).length + 1}`
  }

  addSkill(key: keyof typeof SKILLS, x: number, y: number) {
    const { title, description, type, iconTexture } = SKILLS[key]
    const rank = this.defineSkillRank(key)

    const skillWrap = this.scene.add.container(x, y).setName(title)
    const icon = this.scene.add.image(0, 0, iconTexture).setOrigin(0)
    const text = this.scene.add.text(75, -32, `${title}, ${rank}`, { fontSize: '24px', fontFamily: 'Arial' }).setOrigin(0.5, 0)
    const badge = new Badge({
      scene: this.scene,
      x: 75,
      y: 180,
      text: type,
      color: TYPE_TO_COLOR_MAP[type],
    })

    const descriptionNode = this.scene.add.text(icon.width / 2, 228, description, {
      wordWrap: { width: 240 },
      align: 'center',
      fontSize: '20px',
      fontFamily: 'Arial',
    }).setOrigin(0.5, 0)

    const light = this.scene.add.pointlight(75, 75, TYPE_TO_COLOR_MAP[type], 120, 0.5, 0.05)

    skillWrap.add([icon, text, badge, descriptionNode, light])
    this.scene.add.existing(skillWrap)
    this.add(skillWrap)

    const runIconHoverTween = (radius: number) => {
      return this.scene.add.tween({
        paused: true,
        targets: light,
        radius: radius,
        duration: 400,
      })
    }

    icon
      .setInteractive()
      .on('pointerdown', () => {
        const scene = this.scene as LevelUp
        scene.continueGame(key)
      })
      .on('pointerover', () => {
        runIconHoverTween(150).play()
      })
      .on('pointerout', () => {
        runIconHoverTween(120).play()
      })
  }
}
