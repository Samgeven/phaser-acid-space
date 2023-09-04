
import config from './config';
import GameScene from './src/scenes/Main';
import { GameOver } from './src/scenes/GameOver'

new Phaser.Game(
  {...config, scene: [GameScene, GameOver]}
)