import { COLLISION_CATEGORIES } from '../data/collision'
import { SKILLS } from '../data/skills'
import Main from '../scenes/Main'
import { Projectile } from './projectile'

export class Ball extends Phaser.GameObjects.Image {
  scene: Main
  matterBall: Phaser.Physics.Matter.Image
  aimGraphics: Phaser.GameObjects.Graphics
  aimingLine: Phaser.Geom.Line
  isInvincible: boolean = false
  emitter?: Phaser.GameObjects.Particles.ParticleEmitter
  stats = {
    hp: {
      max: 3,
      current: 3,
    },
    spread: 0.1,
    speed: 7,
    invincibleDuration: 7, // number of ticks with 100ms interval
    shootingSpeed: 400,
    range: 400
  }
  skills: Array<keyof typeof SKILLS> = []

  constructor(scene: Main) {
    super(scene, 200, 200, 'ball')
    scene.add.existing(this)
    this.scene = scene

    const body = scene.matter.add.circle(this.scene.game.scale.width / 2, this.scene.game.scale.height / 2, 14, {
      friction: 0.1,
      label: 'ball',
      collisionFilter: {
        category: COLLISION_CATEGORIES.BALL,
        mask: COLLISION_CATEGORIES.ENEMIES | COLLISION_CATEGORIES.WALLS,
      },
    })
    const matterBall = scene.matter.add.gameObject(this, body) as Phaser.Physics.Matter.Sprite

    const matterImage = matterBall as Phaser.Physics.Matter.Image
    this.matterBall = matterImage

    matterImage.setDepth(2)
    matterImage.setBounce(0.1)
    matterImage.setFrictionAir(0.1)
    matterImage.setIgnoreGravity(true)
    matterImage.setMass(20)
    this.setName('ball')
    this.addEmitter()

    this.aimingLine = new Phaser.Geom.Line()
    this.aimGraphics = scene.add.graphics()

    this.scene.input.on(
      'pointermove',
      (pointer: Phaser.Input.Pointer) => {
        this.updateAimingLine(pointer)
      },
      this
    )

    this.matterBall.setOnCollide((e: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      this.scene.collisionManager?.handleInteractions(e)
    })

    this.changeSize(1.2)
  }

  addEmitter() {
    const particles = this.scene.add.particles('particle').setDepth(1)

    this.emitter = particles.createEmitter({
      x: this.x,
      y: this.y,
      lifespan: 140,
      speed: { min: 100, max: 200 },
      scale: { start: 5 * this.scale, end: 0 },
      quantity: 1,
      blendMode: 'ADD',
      timeScale: 0.6,
      follow: this,
    })
  }

  setInvincible() {
    this.isInvincible = true
    this.emitter?.setTint(0xff2929)

    this.scene.tweens.add({
      repeat: this.stats.invincibleDuration,
      yoyo: true,
      alpha: 0.1,
      targets: this.matterBall,
      duration: 100,
      onComplete: () => {
        this.isInvincible = false
        this.emitter?.setTint(0xff7629)
      },
    })
  }

  reduceHp() {
    this.stats.hp.current -= 1
    this.scene.events.emit('hp-lost', this.stats.hp.current)
    this.setInvincible()
  }

  restoreHp() {
    if (this.stats.hp.current === this.stats.hp.max) {
      return
    }
    this.stats.hp.current += 1
    this.scene.events.emit('hp-restored', this.stats.hp.current)
  }

  setMaxHp() {
    this.stats.hp.max =+ 1
    this.restoreHp()
  }

  updateAimingLine(pointer: Phaser.Input.Pointer) {
    Phaser.Geom.Line.SetToAngle(
      this.aimingLine,
      this.body.position.x,
      this.body.position.y,
      Phaser.Math.Angle.Between(this.body.position.x, this.body.position.y, pointer.x, pointer.y),
      this.scale * 15
    )
    this.aimGraphics.clear()
    this.aimGraphics.lineStyle(this.scale * 5, 0xffffff, 0.5)
    this.aimGraphics.strokeCircle(this.aimingLine.x2, this.aimingLine.y2, 3).setDepth(3)
  }

  changeSize(size: number) {
    this.setScale(this.scale * size)
    this.addEmitter()
  }

  setPrecision(value: number) {
    this.stats.spread *= value
  }

  setSpeed(value: number) {
    this.stats.speed *= value
  }

  shootRandomProjectiles(count: number) {
    this.scene.time.addEvent({
      delay: 80,
      callback: () => {
        const randomX = Phaser.Math.Between(0, this.scene.scale.width)
        const randomY = Phaser.Math.Between(0, this.scene.scale.height)
        const angle = Phaser.Math.Angle.Between(this.body.position.x, this.body.position.y, randomX, randomY)

        new Projectile({
          scene: this.scene,
          angle: angle,
          startingPoint: this,
          lifespan: 400,
          speed: 20,
        })
      },
      callbackScope: this,
      repeat: count
    })
  }
  
  setInvincibilityDuration(dur: number) {
    this.stats.invincibleDuration = Math.floor(dur * this.stats.invincibleDuration)
  }

  setShootingSpeed(value: number) {
    this.stats.shootingSpeed *= value
    this.scene.events.emit('shooting-speed-update', this.stats.shootingSpeed)
  }

  setShootingRange(value: number) {
    this.stats.range *= value
  }
}
