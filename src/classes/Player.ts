import { User, GuildMember } from 'discord.js'

import { Fighter } from './Fighter'

import { UserInt } from '../database/models/UserModel'

import { getLevelFromExp } from '../modules/utils'

// Player extends Fighter and it used to easily create Fighter class based on
// discord.js User.

export class Player extends Fighter {
  id: string
  user: User

  /** Creates Player instance from GuildMember */
  constructor(member: GuildMember, userInt: UserInt) {
    super(member.displayName)
    this.user = member.user
    this.id = member.user.id
    this.imageUrl = member.displayAvatarURL()

    // Add stats based on class and level
    this.level = getLevelFromExp(userInt.exp)
    this.class = userInt.class
    this.critChance = (5 + this.level) * 0.01
    this.critDamage = 1 + this.level * 0.1
    switch (this.class) {
      case 'barbarian':
        this.hp = 75 + this.level * 15
        this.maxHp = 75 + this.level * 15
        this.strength = 10 + this.level * 3
        this.endurance = 5 + this.level * 2
        this.finesse = 5 + this.level * 2
        this.intellect = 5 + this.level * 0
        break
      case 'knight':
        this.hp = 80 + this.level * 20
        this.maxHp = 80 + this.level * 20
        this.strength = 5 + this.level * 2
        this.endurance = 10 + this.level * 3
        this.finesse = 5 + this.level * 0
        this.intellect = 5 + this.level * 2
        break
      case 'mage':
        this.hp = 61 + this.level * 9
        this.maxHp = 61 + this.level * 9
        this.strength = 5 + this.level * 1
        this.endurance = 5 + this.level * 1
        this.finesse = 5 + this.level * 1
        this.intellect = 10 + this.level * 4
        break
      case 'rogue':
        this.hp = 68 + this.level * 12
        this.maxHp = 68 + this.level * 12
        this.strength = 5 + this.level * 2
        this.endurance = 5 + this.level * 2
        this.finesse = 10 + this.level * 3
        this.intellect = 5 + this.level * 1
        break
      default:
        this.hp = 60 + this.level * 5
        this.maxHp = 60 + this.level * 5
        this.strength = 5 + this.level
        this.endurance = 5 + this.level
        this.finesse = 5 + this.level * 0
        this.intellect = 5 + this.level * 0
        break
    }
  }
}
