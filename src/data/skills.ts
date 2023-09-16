type Skill = {
  title: string,
  description: string,
  iconTexture: string,
  type: keyof typeof TYPE_TO_COLOR_MAP,
  ranks: Array<Object>
}

export const TYPE_TO_COLOR_MAP = Object.freeze({
  escape: 0xf9f871,
  survival: 0x6de09f,
  offensive: 0xff3688,
})

export const SKILLS: { [key: string]: Skill } = Object.freeze({
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
    type: 'escape',
    ranks: [
      {
        speed: 1.15
      },
      {
        speed: 1.15
      },
      {
        speed: 1.2
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
        precision: 1.15
      },
      {
        precision: 1.15
      },
      {
        precision: 1.15
      },
    ]
  },
})
