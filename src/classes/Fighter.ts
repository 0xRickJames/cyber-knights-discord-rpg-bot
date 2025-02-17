import { EmbedBuilder } from 'discord.js'

import { Base } from './Base'
//import { Armor } from "./Armor";
//import { Weapon } from "./Weapon";
//import { Spell } from "./Spell";
//import { Skill } from "./Skill";
//import { Item } from "./Item";

import { formatPercent, random, BLUE } from '../modules/utils'
import { format } from 'path'

//  Fighter is base class to be used in Battle. Only class derived from Fighter
//  can be used in Battle.

export class Fighter extends Base {
  // Fighter name
  name: string
  // Fighter unique id
  id: string
  // Experience Points
  exp = 0
  // Gold
  gold = 0
  // Level
  level?: number
  // Class
  class?: string
  // Damage dealt when attack
  attack = 5
  // Fighter's health point
  hp = 75
  // Amount of damage blocked when Fighter gets attacked
  armor = 0.1
  // percent used for skill checks
  finesse = 0.01
  // percent used for magic checks
  intellect = 0.01
  // class bonus percentage
  classBonus = 0.01
  // Percentage to get critical attack
  critChance = 0.01
  // Critical attack percentage increment
  critDamage = 1.1
  // Array of equipped armors
  //equippedArmors: Armor[] = []
  // Array of equipped weapons
  //equippedWeapons: Weapon[] = []
  // Array of equipped items
  //equippedItems: Item[] = []
  // Fighter's Skill
  //skill?: Skill
  skillActive?: boolean
  // Fighter's Spell
  //spell?: Spell
  hasSpell?: boolean
  // Image to represent this Fighter
  imageUrl?: string
  battleWins?: number
  raidWins?: number
  regen = 0
  poisoned = 0
  poisons = 0
  bossTeam = false
  owner?: Fighter

  constructor(name: string) {
    super()
    this.name = name
    this.id = name
  }
  /*
  // Add new armor to the user
  equipArmor(armor: Armor) {
    this.armor += armor.armor
    this.equippedArmors.push(armor)
  }
  // Add new armor to the user
  unEquipArmor(armor: Armor) {
    this.armor -= armor.armor
    const index = this.equippedArmors.findIndex((x) => x.id === armor.id)
    this.equippedArmors.splice(index, 1)
  }

  // Add new weapon to the user
  equipWeapon(weapon: Weapon) {
    this.attack += weapon.attack
    this.equippedWeapons.push(weapon)
  }
  // Remove weapon to the user
  unEquipWeapon(weapon: Weapon) {
    this.attack += weapon.attack
    const index = this.equippedWeapons.findIndex((x) => x.id === weapon.id)
    this.equippedWeapons.splice(index, 1)
  }

  // Add new item to the user
  equipItem(item: Item) {
    if (item.boostAttack) this.attack += item.boostAttack!
    if (item.boostArmor) this.armor += item.boostArmor!
    if (item.boostHp) this.hp += item.boostHp!
    if (item.boostCritChan) this.critChance += +item.boostCritChan!
    if (item.boostCritDam) this.critDamage += item.boostCritDam!
    if (item.regen) this.regen += item.regen!
    if (item.poisons) this.poisons += item.poisons!
    this.equippedItems.push(item)
  }
  // Add new item to the user
  unEquipItem(item: Item, index: number) {
    if (item.boostAttack) this.attack -= item.boostAttack!
    if (item.boostArmor) this.armor -= item.boostArmor!
    if (item.boostHp) this.hp -= item.boostHp!
    if (item.boostCritChan) this.critChance -= +item.boostCritChan!
    if (item.boostCritDam) this.critDamage -= item.boostCritDam!
    if (item.regen) this.regen -= item.regen!
    if (item.poisons) this.poisons -= item.poisons!
    //const index = this.equippedWeapons.findIndex((x) => x.id === item.id);
    this.equippedItems.splice(index, 1)
  }
*/
  // Returns true if critical attack
  isCrit() {
    return random.bool(this.critChance)
  }

  // EmbedBuilder that represents this Fighter. Passing another Fighter in this
  // method will make comparison between this Fighter stat with the other

  show() {
    const armor = this.armor.toString()
    const critChance = formatPercent(this.critChance)
    const classBonus = formatPercent(this.classBonus)
    /*
    const armorList = this.equippedArmors
      .map((x, i) => `${i + 1}. ${x.name}`)
      .join('\n')

    const weaponList = this.equippedWeapons
      .map((x, i) => `${i + 1}. ${x.name}`)
      .join('\n')

    const itemList = this.equippedItems
      .map((x, i) => `${i + 1}. ${x.name}`)
      .join('\n')
*/
    const embed = new EmbedBuilder()
      .setTitle('Profile')
      .setColor(BLUE)
      .addFields(
        { name: 'Name', value: this.name, inline: false },
        {
          name: '💪Class/Level',
          value:
            (this.class
              ? this.class.toString().charAt(0).toUpperCase() +
                this.class.toString().slice(1)
              : 'None') +
            '   ' +
            (this.level?.toString() || 'none'),
          inline: false,
        },
        {
          name: '♥Hit Points',
          value: Math.round(this.hp).toString(),
          inline: true,
        },
        { name: '🛡Defense', value: armor, inline: true },

        {
          name: '🗡Attack',
          value: Math.round(this.attack).toString(),
          inline: true,
        },
        {
          name: 'Finesse',
          value: (this.finesse * 100).toFixed(0).toString(),
          inline: true,
        },
        {
          name: 'Intellect',
          value: (this.intellect * 100).toFixed(0).toString(),
          inline: true,
        },
        {
          name: 'Class Bonus',
          value: classBonus,
          inline: true,
        },
        {
          name: '🎯Crit Hit',
          value: `${critChance}/x${this.critDamage.toFixed(1)}`,
          inline: true,
        },
        {
          name: '💰Gold',
          value: this.gold?.toString() || 'none',
          inline: true,
        },
        {
          name: 'Experience',
          value: this.exp?.toString() || 'none',
          inline: true,
        },
        { name: '🛡Armors', value: 'none', inline: true }, //  armorList || 'none', inline: true },
        { name: '🗡Weapons', value: 'none', inline: true }, //  weaponList || 'none', inline: true },
        { name: '🧠Skills', value: 'none', inline: true }, // this.skill?.name || 'none', inline: true },
        { name: '🦉Spells', value: 'none', inline: true }, //  this.spell?.name || 'none', inline: true },
        { name: '💍Items', value: 'none', inline: true } //  itemList || 'none', inline: true },
      )

    if (this.imageUrl) embed.setThumbnail(this.imageUrl)

    return embed
  }
  /*
  showBoss() {
    const armor = formatPercent(this.armor)
    const critChance = formatPercent(this.critChance)

    const armorList = this.equippedArmors
      .map((x, i) => `${i + 1}. ${x.name}`)
      .join('\n')

    const weaponList = this.equippedWeapons
      .map((x, i) => `${i + 1}. ${x.name}`)
      .join('\n')

    const embed = new EmbedBuilder()
      .setTitle('Profile')
      .setColor(BLUE)
      .addFields(
        { name: 'Name', value: this.name, inline: false },
        {
          name: '📝Experience',
          value: this.exp?.toString() || 'none',
          inline: true,
        },
        {
          name: '💰Gold',
          value: this.gold?.toString() || 'none',
          inline: true,
        },
        { name: '♥HP', value: Math.round(this.hp).toString(), inline: true },
        {
          name: '🗡Attack',
          value: Math.round(this.attack).toString(),
          inline: true,
        },
        { name: '🎯Crit Chance', value: critChance, inline: true },
        {
          name: '👊Crit Damage',
          value: `x${this.critDamage.toFixed(1)}`,
          inline: true,
        },
        { name: '🛡Armor', value: armor, inline: true },
        { name: '🧠Skill', value: this.skill?.name || 'none', inline: true },
        { name: '🦉Spell', value: this.spell?.name || 'none', inline: true },
        { name: '🛡Armors', value: armorList || 'none', inline: true },
        { name: '🗡Weapons', value: weaponList || 'none', inline: true }
      )

    if (this.imageUrl) embed.setThumbnail(this.imageUrl)

    return embed
  }
*/
}
