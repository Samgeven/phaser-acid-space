import { SKILLS } from "../data/skills"
import Main from "../scenes/Main"
import { Ball } from "./ball"

export class LevelUpManager {
  scene: Main

  constructor(scene: Main) {
    this.scene = scene
  }

  getRandomSkillset() {
    const ball = this.scene.children.getByName('ball') as Ball
    const skills = ball.skills
    let skillPool = Object.keys(SKILLS)

    const createRandomPool = () => {
      if (skillPool.length <= 3 ) {
        return skillPool
      }

      let shuffledPool = skillPool.sort(() => 0.5 - Math.random());
      return shuffledPool.slice(0, 3)
    }

    if (skills.length === 0) {
      return createRandomPool()
    }

    skills.forEach(el => {
      const currentRank = skills.filter(skill => skill === el).length
      if (SKILLS[el].ranks.length > 0 && SKILLS[el].ranks.length <= currentRank) {
        skillPool = skillPool.filter(_skill => _skill !== el)
      }
    })

    return createRandomPool()
  }

  updateBallStats(skill: keyof typeof SKILLS) {
    const ball = this.scene.children.getByName('ball') as Ball
    const rank = ball.skills.filter(el => el === skill).length - 1

    switch(skill) {
      case 'bulky':
        ball.changeSize(SKILLS[skill].ranks[rank].size)
        ball.setMaxHp()
        break
      case 'evasive':
        ball.setSpeed(SKILLS[skill].ranks[rank].speed)
        break
      case 'sharpshooter':
        ball.setPrecision(SKILLS[skill].ranks[rank].spread)
        break
      case 'restoration':
        ball.shootRandomProjectiles(15)
        ball.restoreHp()
        break
      case 'sturdy':
        ball.setInvincibilityDuration(SKILLS[skill].ranks[rank].duration)
        break
      case 'frenzy':
        ball.setShootingSpeed(SKILLS[skill].ranks[rank].cooldown)
        ball.setPrecision(SKILLS[skill].ranks[rank].spread)
        ball.setShootingRange(SKILLS[skill].ranks[rank].range)
    }
  }
}
