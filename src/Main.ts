import Phaser from "phaser";

export default class Main extends Phaser.Scene {
  constructor() {
    super('main')
  }

  preload () {
    this.load.image('logo', '/logo.png')
  }
    
  create () {
    const logo = this.add.image(400, 150, 'logo').setName('logo')
  
    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1
    })
  }
}