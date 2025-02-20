import { EmbedBuilder } from 'discord.js'

import { Base } from './Base'
import { Armor } from './Armor'
import { Weapon } from './Weapon'
import { Skill } from './Skill'
import { Spell } from './Spell'
//import { Item } from "./Item";

import { formatPercent, random, BLUE } from '../modules/utils'
import { format } from 'path'

//  Fighter is base class to be used in Battle. Only class derived from Fighter
//  can be used in Battle.

export class Fighter extends Base {
  name: string // Fighter name
  id: string // Fighter unique id
  exp = 0 // Experience Points for levels
  gold = 0 // Gold for purchasing upgrades
  level = 0 // Level
  class?: string
  hp = 100 // Hit points
  maxHp = 100 // Maximum hit points
  strength = 5 // weapon effectiveness
  endurance = 5 // armor effectiveness
  finesse = 1 // percent used for skill checks
  intellect = 1 // percent used for magic checks
  defense = 0 // Amount of damage blocked when Fighter gets attacked
  attack = 0 // Damage dealt when attack
  classBonus = 0.01 // class bonus percentage
  critChance = 0.01 // Percentage to get critical attack
  critDamage = 1.1 // Critical attack percentage increment
  equippedArmors: Armor[] = [] // Array of equipped armors
  equippedWeapons: Weapon[] = [] // Array of equipped weapons
  //equippedItems: Item[] = []   // Array of equipped items
  skills: Skill[] = [] // Fighter's Skills
  skillActive?: boolean
  spells: Spell[] = [] // Fighter's Spells
  hasSpell?: boolean
  imageUrl?: string // Image to represent this Fighter
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
  // Add or remove armor from user
  equipArmor(armor: Armor) {
    this.defense += armor.defense
    this.equippedArmors.push(armor)
  }
  unEquipArmor(armor: Armor) {
    this.defense -= armor.defense
    const index = this.equippedArmors.findIndex((x) => x.id === armor.id)
    this.equippedArmors.splice(index, 1)
  }
  // Add or remove weapons from user
  equipWeapon(weapon: Weapon) {
    this.attack += weapon.attack
    this.equippedWeapons.push(weapon)
  }
  unEquipWeapon(weapon: Weapon) {
    this.attack -= weapon.attack
    const index = this.equippedWeapons.findIndex((x) => x.id === weapon.id)
    this.equippedWeapons.splice(index, 1)
  }
  // Add or remove skills from user
  addSkill(skill: Skill) {
    this.skills.push(skill)
  }
  removeSkill(skill: Skill) {
    const index = this.skills.findIndex((x) => x.id === skill.id)
    this.skills.splice(index, 1)
  }
  addSpell(spell: Spell) {
    this.spells.push(spell)
  }
  removeSpell(spell: Spell) {
    const index = this.spells.findIndex((x) => x.id === spell.id)
    this.spells.splice(index, 1)
  }
  /*
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
    const armor = (this.defense * 100).toString()
    const attack = (this.attack * 100).toString()
    const critChance = formatPercent(this.critChance)

    const armorList = this.equippedArmors.map((x, i) => `${x.name}`).join('\n')

    const weaponList = this.equippedWeapons
      .map((x, i) => `${x.name}`)
      .join('\n')
    const skillList = this.skills.map((x, i) => `${x.name}`).join('\n')
    const spellList = this.spells.map((x, i) => `${x.name}`).join('\n')
    /*
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
        { name: 'Endurnace', value: this.endurance.toString(), inline: true },

        {
          name: 'Strength',
          value: this.strength.toString(),
          inline: true,
        },
        {
          name: 'Finesse',
          value: this.finesse.toString(),
          inline: true,
        },
        {
          name: 'Intellect',
          value: this.intellect.toString(),
          inline: true,
        },
        {
          name: '🎯Crit Hit',
          value: `${critChance}  x${this.critDamage.toFixed(1)}`,
          inline: true,
        },
        { name: '🛡Armors', value: armorList || 'none', inline: true },
        { name: '🗡Weapons', value: weaponList || 'none', inline: true },
        { name: '💍Items', value: 'none', inline: true }, //  itemList || 'none', inline: true },
        { name: '🧠Skills', value: skillList || 'none', inline: true },
        { name: '🦉Spells', value: spellList || 'none', inline: true },
        {
          name: '💰Gold',
          value: this.gold?.toString() || 'none',
          inline: true,
        }
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
