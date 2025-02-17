import { User, GuildMember } from 'discord.js'

import { UserInt } from '../database/models/UserModel'

import { getLevelFromExp } from '../modules/utils'

import { Fighter } from './Fighter'

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
    this.critDamage = 1.1 + this.level * 0.1
    this.classBonus = (0.5263 * this.level + 4.4737) * 0.01
    switch (this.class) {
      case 'barbarian':
        this.hp = 120 + (this.level - 1) * 10
        this.attack = 10 + (this.level - 1) * 5
        this.armor = 5 + (this.level - 1) * 2
        this.finesse = this.level * 0.02
        this.intellect = this.level * 0.01
        break
      case 'knight':
        this.attack = 8 + (this.level - 1) * 2
        this.hp = 140 + (this.level - 1) * 20
        this.armor = 10 + (this.level - 1) * 10
        this.finesse = this.level * 0.02
        this.intellect = this.level * 0.01
        break
      case 'mage':
        this.attack = 4 + (this.level - 1)
        this.hp = 100 + (this.level - 1) * 5
        this.armor = 2 + (this.level - 1) * 2
        this.finesse = this.level * 0.02
        this.intellect = (10 + this.level) * 0.02
        break
      case 'rogue':
        this.attack = 7 + (this.level - 1) * 2
        this.hp = 110 + (this.level - 1) * 8
        this.armor = 3 + (this.level - 1) * 2
        this.finesse = (10 + this.level - 1) * 0.02
        this.intellect = this.level * 0.01
      default:
        break
    }
  }
}
