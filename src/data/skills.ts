type Skill<T extends SkillKeys> = {
  title: string,
  description: string,
  iconTexture: string,
  type: keyof typeof TYPE_TO_COLOR_MAP,
  ranks: Array<RankData[T]>
}

export type SkillKeys = 'bulky' | 'evasive' | 'sharpshooter' | 'frenzy' | 'restoration' | 'sturdy'

type RankData = {
  'bulky': { hp: number, size: number },
  'evasive': { speed: number, size?: 0.85 },
  'sharpshooter': { spread: number },
  'frenzy': { spread: number, cooldown: number, range: number },
  'restoration': {},
  'sturdy': { duration: number },
};

export const TYPE_TO_COLOR_MAP = Object.freeze({
  mixed: 0xf9f871,
  survival: 0x6de09f,
  offensive: 0xff3688,
})

export const SKILLS: { [T in SkillKeys]: Skill<T> } = Object.freeze({
  bulky: {
    title: 'Bulky',
    description: 'Gain 1 max hp, hero size is increased by 15%',
    iconTexture: 'bulky',
    type: 'survival',
    ranks: [
      {
        hp: 1,
        size: 1.1
      },
      {
        hp: 1,
        size: 1.15
      },
      {
        hp: 1,
        size: 1.2
      },
    ]
  },
  evasive: {
    title: 'Evasive',
    description: 'Gain +15% movement speed',
    iconTexture: 'evasive',
    type: 'mixed',
    ranks: [
      {
        speed: 1.15
      },
      {
        speed: 1.2
      },
      {
        speed: 1.2,
        size: 0.85
      },
    ]
  },
  sharpshooter: {
    title: 'Sharpshooter',
    description: '+15% precision',
    iconTexture: 'sharpshooter',
    type: 'offensive',
    ranks: [
      {
        spread: 0.85
      },
      {
        spread: 0.85
      },
      {
        spread: 0.85
      },
    ]
  },
  frenzy: {
    title: 'Frenzy',
    description: 'Drastically increases shooting speed, but also increases spread',
    iconTexture: 'frenzy',
    type: 'offensive',
    ranks: [
      {
        cooldown: 0.7,
        spread: 5,
        range: 0.75
      },
    ]
  },
  restoration: {
    title: 'Restoration',
    description: 'Restore 1 hp. Shoot projectiles in random directions',
    iconTexture: 'restoration',
    type: 'mixed',
    ranks: []
  },
  sturdy: {
    title: 'Sturdy',
    description: 'Invincibility after taking damage lasts longer (+25%)',
    iconTexture: 'sturdy',
    type: 'survival',
    ranks: [
      {
        duration: 1.25,
      },
      {
        duration: 1.25,
      },
      {
        duration: 1.25,
      },
    ]
  },
})
