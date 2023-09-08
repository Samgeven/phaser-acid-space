import { COLLISION_CATEGORIES } from "../data/collision"
import Main from "../scenes/Main"

export class Ball extends Phaser.GameObjects.Image {
  scene: Main
  matterBall: Phaser.Physics.Matter.Image
  aimGraphics: Phaser.GameObjects.Graphics
  aimingLine: Phaser.Geom.Line
  isInvincible: boolean = false
  emitter?: Phaser.GameObjects.Particles.ParticleEmitter
  hp: number = 3

  constructor(scene: Main) {
    super(scene, 200, 200, 'ball')
    scene.add.existing(this)
    this.scene = scene

    const body = scene.matter.add.circle(this.scene.game.scale.width / 2, this.scene.game.scale.height / 2, 14, {
      friction: 0.1,
      label: 'ball',
      collisionFilter: {
        category: COLLISION_CATEGORIES.BALL,
        mask: COLLISION_CATEGORIES.ENEMIES | COLLISION_CATEGORIES.WALLS
      }
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

    this.aimingLine = new Phaser.Geom.Line();
    this.aimGraphics = scene.add.graphics()

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.updateAimingLine(pointer);
    }, this);

    this.matterBall.setOnCollide((e: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      this.scene.collisionManager?.handleInteractions(e)
    })
  }

  addEmitter() {
    const particles = this.scene.add.particles('particle').setDepth(1)

    this.emitter = particles.createEmitter({
      x: this.x,
      y: this.y,
      lifespan: 140,
      speed: { min: 100, max: 200 },
      scale: { start: 5, end: 0 },
      quantity: 1,
      blendMode: 'ADD',
      timeScale: 0.6,
      follow: this,
    })
  }
  
  setInvincible(duration: number = 7) {
    this.isInvincible = true
    console.log(this.emitter?.tint)
    this.emitter?.setTint(0xFF2929)

    this.scene.tweens.add({
      repeat: duration,
      yoyo: true,
      alpha: 0.1,
      targets: this.matterBall,
      duration: 100,
      onComplete: () => {
        this.isInvincible = false
        this.emitter?.setTint(0xFF7629)
      }
    })
  }

  reduceHp() {
    this.hp = this.hp - 1
    this.scene.events.emit('hp-lost', this.hp)
    this.setInvincible()
  }

  updateAimingLine(pointer: Phaser.Input.Pointer) {
    Phaser.Geom.Line.SetToAngle(this.aimingLine, this.body.position.x, this.body.position.y, Phaser.Math.Angle.Between(this.body.position.x, this.body.position.y, pointer.x, pointer.y), 15);
    this.aimGraphics.clear();
    this.aimGraphics.lineStyle(5, 0xffffff, 0.5)
    this.aimGraphics.strokeCircle(this.aimingLine.x2, this.aimingLine.y2, 3).setDepth(3)
  }
}