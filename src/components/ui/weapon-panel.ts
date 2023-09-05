import { WeaponSlot } from "./weapon-slot";

export class WeaponPanel extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, weaponSlots: WeaponSlot[]) {
    super(scene, scene.game.scale.width / 2, scene.game.scale.height - 100);
    scene.add.existing(this);

    weaponSlots.forEach((slot) => {
      this.add(slot);
    });

    scene.add.existing(this)
  }
}