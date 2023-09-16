import Main from '../../scenes/Main'
import { Ball } from '../ball'
import { Projectile } from '../projectile'

export class WeaponSlot extends Phaser.GameObjects.Container {
  public icon: Phaser.GameObjects.Image
  private cooldownMask: Phaser.GameObjects.Rectangle
  private cooldownTimer: Phaser.Time.TimerEvent | null
  private cooldownDuration: number

  constructor(scene: Main, x: number, y: number, iconKey: string, cooldownDuration: number) {
    super(scene, 0, 0)
    scene.add.existing(this)

    this.icon = this.scene.add.image(0, 0, iconKey).setScale(0.5)
    this.icon.setInteractive()
    this.add(this.icon)

    this.cooldownMask = this.scene.add.rectangle(x, y, this.icon.width, this.icon.height, 0xffffff, 0.3).setScale(0.5)
    this.add(this.cooldownMask)

    this.on('pointerdown', this.activateSkill, this)

    this.cooldownTimer = null
    this.cooldownDuration = cooldownDuration
    scene.add.existing(this)
  }

  public activateSkill(pointer: Phaser.Input.Pointer): void {
    if (this.cooldownTimer) {
      return
    }

    const ball = this.scene.children.getByName('ball') as Ball
    const angle = Phaser.Math.Angle.Between(ball.body.position.x, ball.body.position.y, pointer.x, pointer.y)
    const { precision } = ball.stats
    const aimingAngle = Phaser.Math.FloatBetween(angle - precision, angle + precision)

    new Projectile({
      scene: this.scene as Main,
      angle: aimingAngle,
      startingPoint: ball,
      lifespan: 400,
      speed: 20,
    })
    this.startCooldown()
  }

  private startCooldown(): void {
    this.cooldownMask.width = this.icon.width
    this.cooldownMask.visible = true

    this.scene.tweens.add({
      targets: this.cooldownMask,
      width: 0,
      duration: this.cooldownDuration,
      onComplete: () => {
        this.cooldownMask.visible = false
        this.cooldownTimer = null
      },
    })

    this.cooldownTimer = this.scene.time.delayedCall(this.cooldownDuration, () => {
      if (!this.cooldownTimer) {
        return
      }
    })
  }
}
