import { WeaponSlot } from "./weapon-slot";

export class WeaponPanel extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, weaponSlots: WeaponSlot[]) {
    super(scene, scene.game.scale.width / 2, scene.game.scale.height - 100);
    scene.add.existing(this);

    const screenWidth = this.scene.game.scale.width;
    const slotSpacing = 10;
    let currentX = 0;

    weaponSlots.forEach((slot) => {
      // slot.setPosition(currentX + slot.icon.width / 2, this.scene.game.scale.height - slot.icon.height / 2);
      // currentX += slot.icon.width + slotSpacing;
      this.add(slot);
    });

    // const totalWidth = currentX - slotSpacing;
    // this.setPosition((screenWidth - totalWidth) / 2, 0);
    scene.add.existing(this)
    console.log(this.x, this.y)
  }
}