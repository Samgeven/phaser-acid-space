import Phaser from 'phaser';
import { Ball } from '../components/ball';
import { Enemy } from '../components/enemy';
import { EnemyGenerator } from '../components/enemy-generator';
import { WeaponPanel } from '../components/weapon-panel';
import { WeaponSlot } from '../components/weapon-slot';
import { COLLISION_CATEGORIES } from '../data/collision';

export default class Main extends Phaser.Scene {
  ball?: Ball
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  controls?: {
    [key: string]: Phaser.Input.Keyboard.Key
  }
  slotA?: WeaponSlot
  hpInfo?: Phaser.GameObjects.Text
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('ball', 'assets/ball.svg');
    this.load.image('particle', 'assets/particle.png');
    this.load.image('white-particle', 'assets/white-particle.png');
    this.load.image('shell', 'assets/enemies/shell.svg');
    this.load.image('peagun', 'assets/weapons/peagun.svg');
  }

  create() {
    if (!this.input.keyboard) {
      throw new Error('keyboard plugin is not enabled')
    }

    const cursors = this.input.keyboard.createCursorKeys();
    const wKey = this.input.keyboard.addKey('W');
    const sKey = this.input.keyboard.addKey('S');
    const aKey = this.input.keyboard.addKey('A');
    const dKey = this.input.keyboard.addKey('D');

    this.setCameraEffects()
    this.setBackgroundEmitter()

    this.controls = { ...this.controls, wKey, sKey, aKey, dKey }
    this.cursors = cursors

    const bounds = this.matter.world.setBounds(0, 0, this.game.scale.width, this.game.scale.height)
    Object.values(bounds.walls).forEach(el => {
      el.collisionFilter = {
        category: COLLISION_CATEGORIES.WALLS,
        mask: COLLISION_CATEGORIES.BALL,
        group: 0
      }
    })
    
    this.ball = new Ball(this)
    const generator = new EnemyGenerator(this)
    generator.start()

    const weaponSlot = new WeaponSlot(this, 0, 0, 'peagun', 500)
    new WeaponPanel(this, [weaponSlot])
    this.slotA = weaponSlot

    this.hpInfo = this.add.text(40, 40, `Hp: ${this.ball.hp}`, { fontSize: '24px' })
    this.events.on('hp-lost', (current: number) => {
      if (current < 1) {
        this.scene.start('game-over')
      }
      this.hpInfo?.setText(`Hp: ${current}`)
    })
  }

  update(time: number, delta: number): void {
    this.handleControls()
    const enemy = this.children.getChildren().filter(el => el.name === 'enemy') as Enemy[]
    enemy?.forEach(el => el.followPlayer())
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
      x: this.game.scale.width + 100, // Initial x position of the emitter
      y: { min: 0, max: this.game.scale.height }, // Initial y position of the emitter
      speed: { min: 150, max: 200 }, // Speed range for particles
      angle: 0, // Angle range for particles
      gravityY: 0, // Set gravity to zero for particles to move horizontally
      gravityX: -500,
      lifespan: 10000, // Lifespan of particles in milliseconds
      blendMode: 'ADD', // Blend mode for particles
      scale: { min: 0.5, max: 2 }, // Scale range for particles
      alpha: { min: 0.1, max: 0.3 }, // Alpha range for particles
      frequency: 200
    };

    const emitter = this.add.particles('white-particle').createEmitter(emitterConfig)
  }

  handleControls() {
    const ball = this.ball?.matterBall
    if (!ball || this.isVelocityLimitExceeded(ball)) {
      return
    }

    if (this?.cursors?.up.isDown || this?.controls?.wKey?.isDown) {
      ball.setVelocityY(-10)
    }
    if (this?.cursors?.down.isDown || this?.controls?.sKey.isDown) {
      ball.setVelocityY(10)
    }
    if (this?.cursors?.left.isDown || this?.controls?.aKey.isDown) {
      ball.setVelocityX(-10)
    }
    if (this?.cursors?.right.isDown || this?.controls?.dKey.isDown) {
      ball.setVelocityX(10)
    }
    if (this.input.mousePointer.isDown) {
      this?.slotA?.activateSkill(this.input.mousePointer);
    }

    this?.ball?.updateAimingLine(this.input.activePointer)
  }
}
