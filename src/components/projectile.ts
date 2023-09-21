import { COLLISION_CATEGORIES } from '../data/collision'
import Main from '../scenes/Main'
import { Enemy } from './enemy'

type ProjectileConfig = {
  scene: Main
  angle: number
  startingPoint: { x: number; y: number }
  lifespan: number
  speed: number
}

export class Projectile {
  body: Phaser.Physics.Matter.Image
  scene: Main
  constructor(config: ProjectileConfig) {
    const { scene, angle, startingPoint, lifespan, speed } = config
    const { x, y } = startingPoint

    const wrapper = scene.add.container(x, y)
    const light = scene.add.pointlight(0, 0, 0xFF3688, 12, 0.5, 0.05)
    const projSprite = scene.add.image(0, 0, 'particle')
    wrapper.add([light, projSprite])

    const projBody = scene.matter.add.circle(x, y, 10, {
      collisionFilter: {
        category: COLLISION_CATEGORIES.PROJECTILES,
        mask: COLLISION_CATEGORIES.ENEMIES | COLLISION_CATEGORIES.WALLS,
      },
      mass: 10,
      label: 'projectile',
    })
    const projectile = scene.matter.add.gameObject(wrapper, projBody) as Phaser.Physics.Matter.Image
    this.body = projectile
    this.scene = scene

    projectile.setIgnoreGravity(true)
    projectile.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle))
    projectile.setOnCollide(
      (e: Phaser.Types.Physics.Matter.MatterCollisionData) => this.scene.collisionManager?.handleInteractions(e)
    )

    scene.time.delayedCall(lifespan, () => {
      scene.tweens.add({
        alpha: 0,
        duration: 100,
        onComplete: () => projectile?.destroy(),
        targets: [projectile],
      })
    })
  }
}
