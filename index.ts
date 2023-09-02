
import config from './config';
import GameScene from './src/Main';

new Phaser.Game(
  {...config, scene: GameScene}
)