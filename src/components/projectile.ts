import { COLLISION_CATEGORIES } from "../data/collision";
import Main from "../scenes/Main";
import { Enemy } from "./enemy";

export class Projectile {
  body: Phaser.Physics.Matter.Image
  scene: Main
  constructor(scene: Main, angle: number, startingPoint: {x: number, y: number}) {
    const { x, y } = startingPoint

    const projSprite = scene.add.image(x, y, 'particle')
    const projBody = scene.matter.add.circle(x, y, 10, {
      collisionFilter: {
        category: COLLISION_CATEGORIES.PROJECTILES,
        mask: COLLISION_CATEGORIES.ENEMIES | COLLISION_CATEGORIES.WALLS
      },
      mass: 10,
      label: 'projectile'
    })
    const projectile = scene.matter.add.gameObject(projSprite, projBody) as Phaser.Physics.Matter.Image
    this.body = projectile
    this.scene = scene
    projectile.setIgnoreGravity(true)

    // Set the velocity of the projectile to move in the direction of the cursor
    var speed = 25; // Adjust the speed of the projectile
    projectile.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle))

    projectile.setOnCollide((e: Phaser.Types.Physics.Matter.MatterCollisionData) => this.scene.collisionManager?.handleInteractions(e))

    scene.time.delayedCall(1500, () => {
      scene.tweens.add({
        alpha: 0,
        duration: 400,
        onComplete: () => projectile?.destroy(),
        targets: [projectile]
      })
    })
  }
}