import { EmbedBuilder } from 'discord.js'
import cloneDeep from 'lodash.clonedeep'
/*
import {
  updateBattleWins,
  updateGold,
  updateRaidWins,
  updateXP,
} from "../modules/updateUserData";
*/
import {
  getRandomSkillIndex,
  getRandomSpellIndex,
  GOLD,
  random,
} from '../modules/utils'
import { Fighter } from './Fighter'
import { BaseBattle } from './BaseBattle'
import { NoSkill, Skill } from './Skill'
//import { Demoralize } from "./Skill";

/**
 * Battle handles all battle simulation using discord.js's embed.
 * */
export class Battle extends BaseBattle {
  protected boss?: Fighter
  onFighterDead?: (fighter: Fighter) => void

  /** Time interval to change to next frame (in milliseconds by default is 6000) */
  interval = 4000

  /**
   * Change the battle to raid mode. Raid mode only have one opponent that is
   * the boss. If the boss dies, the battle ends.
   *
   * @param boss {Fighter} - Boss to be defeated
   * */
  setBoss(boss: Fighter) {
    this.boss = boss
    return this
  }

  /**
   * Executes callback when Fighter dead during battle.
   * */
  setOnFighterDead(cb: (fighter: Fighter) => void) {
    this.onFighterDead = cb
  }

  /**
   * Starts the battle simulation. It will throw error if the array of
   * Fighters is less than 2. This method will return the Fighter object who won
   * the battle.
   *
   * @returns Fighter
   *
   * */
  async run() {
    if (this.fighters.length <= 1)
      throw new Error('cannot battle with 1 or less player')

    const battleQueue = this.fighters.map((x) => cloneDeep(x))
    await this.reply('Starting battle')

    while (battleQueue.length !== 1) {
      this.round++

      const player = battleQueue.shift()!
      let opponent = random.pick(battleQueue)

      const boss = this.boss
      if (boss && player.id !== boss.id) {
        const bossState = battleQueue.find((x) => x.id === boss.id)
        if (bossState) {
          opponent = bossState
        } else {
          break
        }
      }

      if (player.regen) player.hp += player.regen
      if (player.poisoned) player.hp -= player.poisoned
      if (player.poisons) opponent.poisoned += player.poisons

      let playerSkillChance =
        player.class === 'rogue'
          ? random.bool((player.finesse + player.level) * 0.01)
          : player.class === 'mage' || player.class === 'barbarian'
          ? random.bool(player.finesse * 0.01)
          : false
      let opponentSkillChance =
        opponent.class === 'rogue'
          ? random.bool((opponent.finesse + opponent.level) * 0.01)
          : opponent.class === 'mage' || opponent.class === 'barbarian'
          ? random.bool(opponent.finesse * 0.01)
          : false
      let playerRandomSkill
      let opponentRandomSkill

      if (playerSkillChance && player.skills.length > 0) {
        const playerRandomSkillIndex = getRandomSkillIndex(player.skills)
        playerRandomSkill = player.skills[playerRandomSkillIndex]

        const skillEmbed = playerRandomSkill!.use(player, opponent)
        await this.updateEmbed(skillEmbed)
        this.showBattle && (await this.sleep())
        playerSkillChance = random.bool(
          player.finesse + playerRandomSkill.level * 10 * 0.01
        )
      }

      if (opponentSkillChance && opponent.skills.length > 0) {
        const opponentRandomSkillIndex = getRandomSkillIndex(opponent.skills)
        opponentRandomSkill = opponent.skills[opponentRandomSkillIndex]

        const skillEmbed = opponentRandomSkill!.use(opponent, player)
        await this.updateEmbed(skillEmbed)
        this.showBattle && (await this.sleep())
        opponentSkillChance = random.bool(
          opponent.finesse + opponentRandomSkill.level * 10 * 0.01
        )
      }

      let playerSpellChance =
        player.class === 'mage'
          ? random.bool((player.intellect + player.level) * 0.01)
          : player.class === 'knight' || player.class === 'rogue'
          ? random.bool(player.intellect * 0.01)
          : false

      if (playerSpellChance && player.spells.length > 0) {
        const randomSpellIndex = getRandomSpellIndex(player.spells)
        const playerSpell = player.spells[randomSpellIndex]
        const spellEmbed = playerSpell.cast(opponent, player)
        await this.updateEmbed(spellEmbed!)
        this.showBattle && (await this.sleep())
      }

      const battleEmbed = this.attack(player, opponent)

      if (this.showBattle) {
        for (const p1 of this.fighters) {
          const currHealth = [player, ...battleQueue].find(
            (x) => x.id === p1.id
          )?.hp
          const updatePoison = [player, ...battleQueue].find(
            (x) => x.id === p1.id
          )?.poisoned
          if (currHealth !== undefined && updatePoison !== undefined) {
            this.progressBar(
              battleEmbed,
              p1.name,
              currHealth,
              p1.hp,
              updatePoison,
              p1.regen
            )
          }
        }
      }

      await this.updateEmbed(battleEmbed)
      battleQueue.push(player)

      if (opponent.hp <= 0) {
        const index = battleQueue.findIndex((x) => x.id === opponent.id)
        battleQueue.splice(index, 1)

        let text = `${opponent.name} has died in the battle`
        if (this.playerDiedText) {
          text = this.playerDiedText(opponent)
        }

        this.onFighterDead && this.onFighterDead(opponent)
        this.reply(text)
        this.logBattle && console.log(text)

        if (battleQueue.length === 1) break
      }
      if (player.hp <= 0) {
        const index = battleQueue.findIndex((x) => x.id === player.id)
        battleQueue.splice(index, 1)

        let text = `${player.name} has died in the battle`
        if (this.playerDiedText) {
          text = this.playerDiedText(player)
        }

        this.onFighterDead && this.onFighterDead(player)
        this.reply(text)
        this.logBattle && console.log(text)

        if (battleQueue.length === 1) break
      }

      if (playerSkillChance) {
        playerRandomSkill!.close(player, opponent)
      }

      if (opponentSkillChance) {
        opponentRandomSkill!.close(opponent, player)
      }

      this.showBattle && (await this.sleep())
    }

    const winner = battleQueue[0]

    const boss = this.boss
    // if the boss loses
    if (boss && winner.id !== boss.id) {
      const winEmbed = new EmbedBuilder()
        .setColor(GOLD)
        .setTitle('Raid Successfull')
        .setDescription(
          `${boss.name} has been defeated!\n${this.author.name} has earned ${this.exp} EXP and ${this.gold} Gold! `
        )

      if (boss.imageUrl) winEmbed.setThumbnail(boss.imageUrl)

      //await updateXP(this.user_int, this.exp);
      //await updateGold(this.user_int, this.gold);
      //await updateRaidWins(this.user_int);
      await this.reply(winEmbed)
      return this.fighters.find((x) => x.id === winner.id)!
    } else {
      if (winner.id === this.author.id) {
        const winEmbed = new EmbedBuilder()
          .setColor(GOLD)
          .setTitle('Battle Winner')
          .setDescription(
            `${winner.name} has won the battle and earned ${this.exp} EXP and ${this.gold} Gold! `
          )

        if (winner.imageUrl) winEmbed.setThumbnail(winner.imageUrl)

        //await updateXP(this.user_int, this.exp);
        //await updateGold(this.user_int, this.gold);
        //await updateBattleWins(this.user_int);
        await this.reply(winEmbed)
        return this.fighters.find((x) => x.id === winner.id)!
      } else {
        const winEmbed = new EmbedBuilder()
          .setColor(GOLD)
          .setTitle('Battle Winner')
          .setDescription(`${winner.name} has won the battle! `)

        if (winner.imageUrl) winEmbed.setThumbnail(winner.imageUrl)

        await this.reply(winEmbed)
        return this.fighters.find((x) => x.id === winner.id)!
      }
    }
  }
}
