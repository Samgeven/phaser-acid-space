
import config from './config';
import GameScene from './src/scenes/Main';
import { GameOver } from './src/scenes/GameOver'
import { LevelUp } from './src/scenes/LevelUp'

new Phaser.Game(
  {...config, scene: [GameScene, LevelUp, GameOver]}
)