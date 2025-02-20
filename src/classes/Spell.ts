import { EmbedBuilder } from 'discord.js'
import { oneLine } from 'common-tags'

import { Base } from './Base'
import { Fighter } from './Fighter'

import {
  bold,
  BROWN,
  formatPercent,
  getRandomArmorIndex,
  getRandomSpellIndex,
  inlineCode,
  PURPLE,
  random,
} from '../modules/utils'

/**
 * Spell is a companion for Player which can be used in a battle. Spell will attack
 * during battle based on it's own attribute. To add your own spell, extend Spell
 * class and change the attributes to your liking.
 *
 * ```typescript
 *
 * export class Dragon extends Spell {
 *   name = "dragon";
 *   id = "dragon";
 *   attack = 20;
 *   interceptRate = 0.4;
 * }
 * ```
 * */
export abstract class Spell extends Base {
  abstract description: string // Skill description
  imageUrl?: string // Image to represent this Spell
  removesSpell = false // Can remove other spell
  healing = false // Healing
  level = 0 // Level of the spell
  price = 20 * this.level // Price of the spell
  levelReq = 0 // Level required to use the spell

  // EmbedBuilder that represents Spell
  show() {
    const embed = new EmbedBuilder()
      .setTitle('Spell')
      .setColor(PURPLE)
      .addFields(
        { name: 'Name', value: this.name },
        {
          name: 'Level',
          value: inlineCode(this.level),
          inline: true,
        },
        { name: 'Description', value: this.description }
      )

    if (this.imageUrl) {
      embed.setThumbnail(this.imageUrl)
    }

    return embed
  }
  // Action to take by Spell when in Battle
  cast(opponent: Fighter, player: Fighter) {
    const spellPower = this.level * 10 + player.intellect
    const spellHalfPower = spellPower / 2
    const spellResistance = opponent.class === 'mage' ? opponent.intellect : 0
    const spellDamage = spellPower - spellResistance

    if (this.removesSpell == true) {
      if (player.hp <= player.maxHp * 2) {
        player.hp += spellHalfPower
        if (player.hp > player.maxHp * 2) {
          player.hp = player.maxHp * 2
        }
      }
      opponent.hp -= spellHalfPower
      if (opponent.spells.length > 0) {
        const randomSpellIndex = getRandomSpellIndex(opponent.spells)
        const randomSpell = opponent.spells[randomSpellIndex]
        opponent.spells.splice(randomSpellIndex, 1)
        const embed = new EmbedBuilder()
          .setTitle('Drain Cast')
          .setColor(PURPLE)
          .setDescription(
            oneLine`${player.name} casts ${this.name} and DRAINS ${
              opponent.name
            } for
        ${bold(spellHalfPower)} and removes their spell ${randomSpell.name}!`
          )
        if (this.imageUrl) embed.setThumbnail(this.imageUrl)
        return embed
      } else {
        const embed = new EmbedBuilder()
          .setTitle('Drain Cast')
          .setColor(PURPLE)
          .setDescription(
            oneLine`${player.name} casts ${this.name} and DRAINS ${
              opponent.name
            } for
      ${bold(spellHalfPower)}!`
          )
        if (this.imageUrl) embed.setThumbnail(this.imageUrl)
        return embed
      }
    } else if (this.healing) {
      if (player.hp === player.maxHp * 1.5) {
        return
      }
      player.hp += spellPower
      if (player.hp > player.maxHp * 1.5) {
        player.hp = player.maxHp * 1.5
      }
      const embed = new EmbedBuilder()
        .setTitle('Mending Cast')
        .setColor(PURPLE)
        .setDescription(
          oneLine`${player.name}'s ${this.name} HEALS them for
      ${bold(Math.round(spellPower))} Hit Points!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      opponent.hp -= spellDamage
      const embed = new EmbedBuilder()
        .setTitle('Fireball Cast')
        .setColor(PURPLE)
        .setDescription(
          oneLine`${player.name}'s ${this.name} DAMAGES ${opponent.name} for
      ${bold(Math.round(spellDamage))} damage!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }
}

export class LesserFireball extends Spell {
  name = 'Lesser Fireball'
  id = 'lesser_fireball'
  description = 'A spell that damages the opponent and bypasses armor'
  level = 1
  levelReq = 6
}
export class GreaterFireball extends Spell {
  name = 'Greater Fireball'
  id = 'greater_fireball'
  description = 'A spell that damages the opponent and bypasses armor'
  level = 2
  levelReq = 11
}
export class SupremeFireball extends Spell {
  name = 'Supreme Fireball'
  id = 'supreme_fireball'
  description = 'A spell that damages the opponent and bypasses armor'
  level = 3
  levelReq = 16
}
export class AbsoluteFireball extends Spell {
  name = 'Absolute Fireball'
  id = 'absolute_fireball'
  description = 'A spell that damages the opponent and bypasses armor'
  level = 4
  levelReq = 21
}
export class LesserMending extends Spell {
  name = 'Lesser Mending'
  id = 'lesser_mending'
  description = 'A spell that heals the player'
  healing = true
  level = 1
  levelReq = 6
}
export class GreaterMending extends Spell {
  name = 'Greater Mending'
  id = 'greater_mending'
  description = 'A spell that heals the player'
  healing = true
  level = 2
  levelReq = 11
}
export class SupremeMending extends Spell {
  name = 'Supreme Mending'
  id = 'supreme_mending'
  description = 'A spell that heals the player'
  healing = true
  level = 3
  levelReq = 16
}
export class AbsoluteMending extends Spell {
  name = 'Absolute Mending'
  id = 'absolute_mending'
  description = 'A spell that heals the player'
  healing = true
  level = 4
  levelReq = 21
}
export class LesserDrain extends Spell {
  name = 'Lesser Drain'
  id = 'lesser_drain'
  description =
    'A spell that damages the opponent, heals the player and removes an opponents spell'
  canEat = true
  level = 1
  levelReq = 6
}
export class GreaterDrain extends Spell {
  name = 'Greater Drain'
  id = 'greater_drain'
  description =
    'A spell that damages the opponent, heals the player and removes an opponents spell'
  canEat = true
  level = 2
  levelReq = 11
}
export class SupremeDrain extends Spell {
  name = 'Supreme Drain'
  id = 'supreme_drain'
  description =
    'A spell that damages the opponent, heals the player and removes an opponents spell'
  canEat = true
  level = 3
  levelReq = 16
}
export class AbsoluteDrain extends Spell {
  name = 'Absolute Drain'
  id = 'absolute_drain'
  description =
    'A spell that damages the opponent, heals the player and removes an opponents spell'
  canEat = true
  level = 4
  levelReq = 21
}
