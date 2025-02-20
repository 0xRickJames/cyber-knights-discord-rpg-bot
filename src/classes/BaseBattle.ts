import {
  EmbedBuilder,
  ChatInputCommandInteraction,
  APIEmbedField,
} from 'discord.js'

import { UserInt } from '../database/models/UserModel'
import { RED, sleep } from '../modules/utils'

import { Fighter } from './Fighter'

interface PlayerGameStat {
  totalDamageDealt: number
  remainingHP: number
}

export abstract class BaseBattle {
  protected round = 0
  protected exp = 0
  protected gold = 0
  protected author!: Fighter
  protected user_int!: UserInt
  protected i: ChatInputCommandInteraction
  protected fighters: Fighter[]
  protected gameStats: Map<string, PlayerGameStat> = new Map()
  protected playerDiedText?: (fighter: Fighter) => string
  /** Time interval to change to next frame (in milliseconds by default is 6000) */
  interval = 4000

  /** Show battle embed */
  showBattle = true

  /** Logs battle to stdout */
  logBattle = false

  /**
   * @param {ChatInputCommandInteraction} i - discord.js's ChatInputCommandInteraction
   * @param {Fighter[]} fighters - array of Fighter's object
   * */
  constructor(
    i: ChatInputCommandInteraction,
    fighters: Fighter[],
    exp: number,
    gold: number,
    user_int: UserInt,
    author: Fighter
  ) {
    this.i = i
    this.fighters = [...new Set(fighters)]
    this.exp = exp
    this.gold = gold
    this.user_int = user_int
    this.author = author
  }

  protected sleep() {
    return sleep(this.interval)
  }

  private bar(progress: number, maxProgress: number) {
    if (progress < 0) progress = 0

    const maxFill = 20
    const fill = '█'
    const path = ' '
    const fillProgress = Math.round((progress * maxFill) / maxProgress)

    return Array(maxFill)
      .fill(fill)
      .map((v, i) => (fillProgress > i ? v : path))
      .join('')
  }

  protected async reply(options: string | EmbedBuilder) {
    let content: { content?: string; embeds?: EmbedBuilder[] }

    if (options instanceof EmbedBuilder) {
      content = { embeds: [options] }
    } else {
      content = { content: options }
    }

    if (this.i.replied) {
      await this.i.editReply(content)
    } else {
      await this.i.reply(content)
    }
  }

  /** adds progress bar to battleEmbed */
  protected progressBar(
    embed: EmbedBuilder,
    name: string,
    hp: number,
    maxHP: number,
    poisoned: number,
    regen: number
  ) {
    const maxHPStr = Math.round(maxHP)
    const healthBar = this.bar(hp, maxHP)
    const remainingHP = hp >= 0 ? Math.round(hp) : 0
    const hasRegen = regen > 0 ? `⚕+${regen}` : ''
    const isPoisoned = poisoned > 0 ? `☠-${poisoned}` : ''

    embed.addFields({
      name: `${name}    ${hasRegen}   ${isPoisoned}`,
      value: `\`${healthBar}\` \`${remainingHP}/${maxHPStr}\``,
    })
  }

  protected attack(p1: Fighter, p2: Fighter) {
    const isCrit = p1.isCrit()
    const strengthOrOne = p1.strength > 0 ? p1.strength : 1
    const enduranceOrOne = p2.endurance > 0 ? p2.endurance : 1
    const attackModifier = strengthOrOne * p1.attack + strengthOrOne
    const defense = enduranceOrOne * p2.defense + enduranceOrOne
    const attack = isCrit ? attackModifier * p1.critDamage : attackModifier
    const damageDealt = Math.round(attack ** 2 / (attack + defense))
    const critText = isCrit ? ` (x${p1.critDamage.toFixed(1)}) 🎯` : ''
    p2.hp -= damageDealt

    const battleEmbed = new EmbedBuilder().setColor(RED).addFields(
      { name: 'Attacking Player', value: p1.name, inline: true },
      { name: 'Defending Player', value: p2.name, inline: true },
      { name: 'Round', value: `\`${this.round.toString()}\``, inline: true },
      {
        name: 'Attack',
        value: `\`${Math.round(attack)}${critText}\``,
        inline: true,
      },
      {
        name: 'Defense',
        value: `\`${Math.round(defense)}\``,
        inline: true,
      },
      {
        name: 'Damage',
        value: `\`${Math.round(damageDealt)}\``,
        inline: true,
      }
    )

    if (p1.imageUrl) battleEmbed.setThumbnail(p1.imageUrl)

    const p1Stat = this.gameStats.get(p1.id)

    if (p1Stat) {
      this.gameStats.set(p1.id, {
        remainingHP: p1.hp,
        totalDamageDealt: p1Stat.totalDamageDealt + damageDealt,
      })
    } else {
      this.gameStats.set(p1.id, {
        remainingHP: p1.hp,
        totalDamageDealt: damageDealt,
      })
    }

    const p2Stat = this.gameStats.get(p2.id)

    if (p2Stat) {
      this.gameStats.set(p2.id, {
        ...p2Stat,
        remainingHP: p2.hp,
      })
    } else {
      this.gameStats.set(p2.id, {
        remainingHP: p2.hp,
        totalDamageDealt: 0,
      })
    }

    return battleEmbed
  }

  /**
   * Gets total damage dealt for a particular fighter
   * */
  getDamageDealt(id: string) {
    return this.gameStats.get(id)?.totalDamageDealt
  }

  /**
   * Get remaining HP for a particular fighter
   * */
  getRemainingHP(id: string) {
    return this.gameStats.get(id)?.remainingHP
  }

  /**
   * Changes the discord.js message sent when player dies in the battle.
   * */
  setPlayerDeadText(text: (fighter: Fighter) => string) {
    this.playerDiedText = text
  }

  /**
   * Sets the battle scene interval.
   *
   * @param ms {number} - time in milliseconds
   * */
  setInterval(ms: number) {
    this.interval = ms
    return this
  }

  private getEmbedInfo(embed: EmbedBuilder) {
    let result = embed.data.description
      ? `\nDescription: ${embed.data.description}`
      : ''

    for (const field of embed.data.fields as APIEmbedField[]) {
      result += `\n${field.name}: ${field.value}`
    }

    return result
  }

  /**
   * Updates embed and log if enabled.
   * */
  protected async updateEmbed(embed: EmbedBuilder) {
    this.logBattle && console.log(this.getEmbedInfo(embed))
    this.showBattle && (await this.reply(embed))
  }
}
