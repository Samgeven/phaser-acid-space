import Phaser from 'phaser'
import { Ball } from '../components/ball'
import { Enemy } from '../components/enemy'
import { EnemyGenerator } from '../components/enemy-generator'
import { WeaponPanel } from '../components/ui/weapon-panel'
import { WeaponSlot } from '../components/ui/weapon-slot'
import { COLLISION_CATEGORIES } from '../data/collision'
import { StatsManager } from '../components/stats-manager'
import { CollisionManager } from '../components/collision-manager'
import { StatusPanel } from '../components/ui/status-panel'
import { LevelUpManager } from '../components/levelup-manager'
import { SKILLS, SkillKeys } from '../data/skills'

export default class Main extends Phaser.Scene {
  ball?: Ball
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  controls?: {
    [key: string]: Phaser.Input.Keyboard.Key
  }
  slotA?: WeaponSlot
  generator?: EnemyGenerator
  statsManager?: StatsManager
  collisionManager?: CollisionManager
  statusPanel?: StatusPanel
  levelUpManager?: LevelUpManager
  pendingSkill?: SkillKeys

  constructor() {
    super('GameScene')
  }

  preload() {
    this.load.image('ball', 'assets/ball.svg')
    this.load.image('particle', 'assets/particle.png')
    this.load.image('white-particle', 'assets/white-particle.png')
    this.load.image('shell', 'assets/enemies/shell.svg')
    this.load.image('peagun', 'assets/weapons/peagun.svg')
    this.load.image('level-icon', 'assets/level-icon.svg')
    this.load.image('hp-chunk', 'assets/hp-chunk.svg')
  }

  init(skill: { skillKey: SkillKeys }) {
    if (skill.skillKey) {
      this.pendingSkill = skill.skillKey
    }
  }

  create() {
    if (!this.input.keyboard) {
      throw new Error('keyboard plugin is not enabled')
    }

    const cursors = this.input.keyboard.createCursorKeys()
    const wKey = this.input.keyboard.addKey('W')
    const sKey = this.input.keyboard.addKey('S')
    const aKey = this.input.keyboard.addKey('A')
    const dKey = this.input.keyboard.addKey('D')

    this.setCameraEffects()
    this.setBackgroundEmitter()

    this.controls = { ...this.controls, wKey, sKey, aKey, dKey }
    this.cursors = cursors

    const bounds = this.matter.world.setBounds(0, 0, this.game.scale.width, this.game.scale.height)
    Object.values(bounds.walls).forEach((el) => {
      el.collisionFilter = {
        category: COLLISION_CATEGORIES.WALLS,
        mask: COLLISION_CATEGORIES.BALL,
        group: 0,
      }
    })

    this.ball = new Ball(this)
    this.generator = new EnemyGenerator(this)
    this.generator.start()

    const weaponSlot = new WeaponSlot(this, 0, 0, 'peagun', 500)
    new WeaponPanel(this, [weaponSlot])
    this.slotA = weaponSlot

    this.statsManager = new StatsManager(this)
    this.collisionManager = new CollisionManager(this)
    this.statusPanel = new StatusPanel(this, 3)
    this.levelUpManager = new LevelUpManager(this)
    this.bindEvents()

    if (this.pendingSkill) {
      this.ball.skills.push(this.pendingSkill)
    }
  }

  update(): void {
    this.handleControls()
    const enemy = this.children.getChildren().filter((el) => el.name === 'enemy') as Enemy[]
    enemy?.forEach((el) => el.followPlayer())
  }

  isVelocityLimitExceeded(matterObj: Phaser.Physics.Matter.Image) {
    const VELOCITY_LIMIT = 10

    if (!matterObj.body) {
      return
    }

    const velocityX = Math.abs(matterObj.body.velocity.x) > VELOCITY_LIMIT
    const velocityY = Math.abs(matterObj.body.velocity.y) > VELOCITY_LIMIT

    if (velocityX || velocityY) {
      return true
    }
    return false
  }

  setCameraEffects() {
    this.cameras.main.setZoom(3)
    this.cameras.main.zoomTo(1, 600)
    this.cameras.main.flash(700)
  }

  setBackgroundEmitter() {
    const emitterConfig = {
      x: this.game.scale.width + 100,
      y: { min: 0, max: this.game.scale.height },
      speed: { min: 150, max: 200 },
      angle: 0,
      gravityY: 0,
      gravityX: -500,
      lifespan: 10000,
      blendMode: 'ADD',
      scale: { min: 0.5, max: 2 },
      alpha: { min: 0.1, max: 0.3 },
      frequency: 200,
    }

    this.add.particles('white-particle').createEmitter(emitterConfig)
  }

  handleControls() {
    if (!this.ball) {
      return
    }

    const ball = this.ball?.matterBall
    const { speed } = this.ball.stats

    if (this?.cursors?.up.isDown || this?.controls?.wKey?.isDown) {
      ball.setVelocityY(-speed)
    }
    if (this?.cursors?.down.isDown || this?.controls?.sKey.isDown) {
      ball.setVelocityY(speed)
    }
    if (this?.cursors?.left.isDown || this?.controls?.aKey.isDown) {
      ball.setVelocityX(-speed)
    }
    if (this?.cursors?.right.isDown || this?.controls?.dKey.isDown) {
      ball.setVelocityX(speed)
    }
    if (this.input.mousePointer.isDown) {
      this?.slotA?.activateSkill(this.input.mousePointer)
    }

    this?.ball?.updateAimingLine(this.input.activePointer)
  }

  bindEvents() {
    this.events.on('enemy-killed', (bounty: number) => {
      if (this.statsManager) {
        this.statsManager.enemyKillCount += 1
      }
      this.statusPanel?.gainExp(bounty)
    })

    this.events.on('hp-lost', (current: number) => {
      if (current < 1) {
        this.generator?.stop()
        this.cameras.main.zoomTo(0.2, 1000, undefined, undefined, (_, progress) => {
          if (progress === 1) {
            this.scene.start('game-over', this.statsManager?.getStats())
          }
        })
      }

      this.statusPanel?.decreaseHp()
    })

    this.events.on('hp-restored', () => {
      this.statusPanel?.restoreHp()
    })

    this.events.on('level-up', () => {
      this.statusPanel?.gainLevel()
      this.scene.pause()
      const skillset = this.levelUpManager?.getRandomSkillset()
      this.scene.launch('level-up', { skills: skillset })
    })
  }
}
