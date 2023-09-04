import { COLLISION_CATEGORIES } from "../data/collision";
import { Enemy } from "./enemy";

export class Projectile {
  projectile: Phaser.Physics.Matter.Image
  scene: Phaser.Scene
  constructor(scene: Phaser.Scene, angle: number, startingPoint: {x: number, y: number}) {
    const { x, y } = startingPoint

    const projSprite = scene.add.image(x, y, 'particle')
    const projBody = scene.matter.add.circle(x, y, 10, {
      collisionFilter: {
        category: COLLISION_CATEGORIES.PROJECTILES,
        mask: COLLISION_CATEGORIES.ENEMIES | COLLISION_CATEGORIES.WALLS
      },
      mass: 10
    })
    const projectile = scene.matter.add.gameObject(projSprite, projBody) as Phaser.Physics.Matter.Image
    this.projectile = projectile
    this.scene = scene
    projectile.setIgnoreGravity(true)

    // Set the velocity of the projectile to move in the direction of the cursor
    var speed = 25; // Adjust the speed of the projectile
    projectile.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle))

    projectile.setOnCollide((e: Phaser.Types.Physics.Matter.MatterCollisionData) => this.enemyCollisionHandler(e))

    scene.time.delayedCall(1500, () => {
      scene.tweens.add({
        alpha: 0,
        duration: 400,
        onComplete: () => projectile?.destroy(),
        targets: [projectile]
      })
    })
  }

  enemyCollisionHandler(e: Phaser.Types.Physics.Matter.MatterCollisionData) {
    const gameObject = e?.bodyA?.gameObject

    if (gameObject instanceof Enemy) {
      this.projectile?.destroy()
      gameObject.setFading().setIgnoreGravity(true)
      this.scene.tweens.add({
        alpha: 0,
        scale: 2,
        duration: 400,
        onComplete: () => {
          gameObject?.destroy()
        },
        targets: [gameObject]
      })
    }
  }
}