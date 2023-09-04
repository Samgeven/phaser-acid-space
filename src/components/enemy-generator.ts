import { Enemy } from "./enemy";

export class EnemyGenerator {
  scene: Phaser.Scene
  spawnTimer: Phaser.Time.TimerEvent | null
  spawnInterval: number
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.spawnTimer = null;
    this.spawnInterval = 2000; // Spawn interval in milliseconds
  }

  start() {
    this.spawnTimer = this.scene.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  stop() {
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
      this.spawnTimer = null;
    }
  }

  spawnEnemy() {
    // Generate random coordinates for the enemy
    const screenWidth = this.scene.game.scale.width
    const screenHeight = this.scene.game.scale.height

    // Generate random coordinates for the enemy outside the screen
    const spawnSide = Phaser.Math.Between(0, 3); // Randomly select a side of the screen

    let x, y;
    switch (spawnSide) {
      case 0: // Top side
        x = Phaser.Math.Between(0, screenWidth);
        y = -100;
        break;
      case 1: // Right side
        x = screenWidth + 100;
        y = Phaser.Math.Between(0, screenHeight);
        break;
      case 2: // Bottom side
        x = Phaser.Math.Between(0, screenWidth);
        y = screenHeight + 100;
        break;
      case 3: // Left side
        x = -100;
        y = Phaser.Math.Between(0, screenHeight);
        break;
      default:
        x = 0;
        y = 0;
    }

    new Enemy(this.scene, x, y);
  }
}