export class CollisionManager {
  scene: Phaser.Scene
  CATEGORIES = {
    BALL: 1,
    ENEMIES: 2,
    PROJECTILES: 4,
    WALLS: 8
  }
  INTERACTIONS = {
    UNNKNOWN: 0,
    BALL_AND_ENEMY: 1,
    PROJECTILE_AND_ENEMY: 2
  }

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  detectGroup(e: Phaser.Types.Physics.Matter.MatterCollisionData) {
    const labelA = e?.bodyA?.label
    const labelB = e?.bodyB?.label

    if (labelA === 'ball' && labelB === 'enemy') {
      return this.INTERACTIONS.BALL_AND_ENEMY
    }

    if (labelA === 'enemy' && labelB === 'projectile') {
      return this.INTERACTIONS.PROJECTILE_AND_ENEMY
    }

    return this.INTERACTIONS.UNNKNOWN
  }

  handleInteractions(e: Phaser.Types.Physics.Matter.MatterCollisionData) {
    const interactionType = this.detectGroup(e)
    console.log(interactionType)

    if (interactionType === this.INTERACTIONS.UNNKNOWN) {
      return
    }

    const bodyA = e?.bodyA?.gameObject
    const bodyB = e?.bodyB?.gameObject

    if (interactionType === this.INTERACTIONS.BALL_AND_ENEMY) {
      if (bodyA.isInvincible) {
        return
      }

      bodyA.reduceHp()
      bodyB.setDisabled()
    }

    if (interactionType === this.INTERACTIONS.PROJECTILE_AND_ENEMY) {
      bodyB?.destroy()
      bodyA.setFading().setIgnoreGravity(true)
      this.scene.tweens.add({
        alpha: 0,
        scale: 2,
        duration: 400,
        onComplete: () => {
          bodyA?.destroy()
        },
        targets: [bodyA]
      })
    }
  }
}