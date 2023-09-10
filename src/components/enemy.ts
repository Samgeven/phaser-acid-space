import { COLLISION_CATEGORIES } from "../data/collision";
import { Ball } from "./ball";

export class Enemy extends Phaser.Physics.Matter.Image {
  speed: number = 2
  isFading: boolean = false
  emitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
  isDisabled: boolean = false
  killBounty: number = 40

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, 'shell', undefined, {
      collisionFilter: {
        category: COLLISION_CATEGORIES.ENEMIES,
        mask: COLLISION_CATEGORIES.BALL | COLLISION_CATEGORIES.PROJECTILES,
      },
      label: 'enemy',
      mass: 2
    })
    
    this.scene = scene;
    this.setIgnoreGravity(true)
    this.setName('enemy')

    this.scene.add.particles('particle')

    this.emitterConfig = {
      x: this?.x,
      y: this?.y,
      lifespan: 140,
      speed: { min: 100, max: 200 },
      scale: { start: 5, end: 0 },
      quantity: 1,
      blendMode: 'ADD',
      timeScale: 0.6,
      follow: this,
      tint: 0x3D4E,
    }
    // Add the enemy to the scene
    scene.add.existing(this);
  }

  setFading() {
    this.isFading = true
    this.setCollisionCategory(5)
    this.setCollisionGroup(5)
    this.scene.events.emit('enemy-killed', this.killBounty)

    const particles = this.scene.add.particles('particle')
    const emitter = particles.createEmitter(this.emitterConfig)
    this.on('destroy', () => emitter.stop())
    return this
  }

  setDisabled(duration: number = 1500) {
    this.isDisabled = true

    this.scene.time.delayedCall(duration, () => {
      this.isDisabled = false
    })

    return this
  }

  followPlayer() {
    if (this.isDisabled) {
      return
    }

    const player = this.scene.children.getByName('ball') as Ball

    if (!player || this.isFading) {
      return
    }

    const playerX = player.x;
    const playerY = player.y;

    const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.setVelocity(velocityX, velocityY);
  }
}