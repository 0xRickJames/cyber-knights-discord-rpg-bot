import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User,
} from 'discord.js'

//import { updateGold, updateXP } from "../modules/updateUserData";
import { getUserData } from '../modules/getUserData'
import { powerUpCheck } from '../modules/powerUpCheck'

import { Command } from '../interfaces/Command'

import { Battle } from '../classes/Battle'
import { Fighter } from '../classes/Fighter'

const allowedOpponents = 20
let oppMultiplier = 0
const opponents: Fighter[] = []

const loopData = new SlashCommandBuilder()
  .setName('battle')
  .setDescription('Battle against one or more opponents!')

for (let i = 1; i <= allowedOpponents; i++) {
  loopData.addUserOption((option) =>
    option
      .setName(`opponent${i}`)
      .setDescription('An opponent to add to the battle.')
      .setRequired(i === 1 ? true : false)
  )
}

export const battle: Command = {
  data: loopData,
  run: async (interaction: ChatInputCommandInteraction) => {
    const player1 = interaction.user as User
    const player1_data = await getUserData(player1.id)
    //await updateXP(player1_data, 5);
    //await updateGold(player1_data, 1);
    const member1 = interaction.guild!.members.cache.get(player1.id)
    const author = await powerUpCheck(member1!, player1.id)
    const opponents: Fighter[] = []
    let oppMultiplier = 0

    for (let i = 1; i <= allowedOpponents; i++) {
      if (interaction.options.getUser(`opponent${i}`) != null) {
        const player = interaction.options.getUser(`opponent${i}`) as User
        if (player.id != player1.id) {
          const member = interaction.guild!.members.cache.get(player.id)
          const opponent = await powerUpCheck(member!, player.id)
          const player_data = await getUserData(player.id)
          //await updateXP(player_data, 5);
          //await updateGold(player_data, 1);
          opponents.push(opponent)
          oppMultiplier += 1
        }
      }
    }
    const uniqueOpponents = Array.from(
      new Set(opponents.map((obj) => obj.id))
    ).map((id) => opponents.find((obj) => obj.id === id)) as Fighter[]

    const exp = 15 * oppMultiplier
    const gold = 3 * oppMultiplier

    const battle = new Battle(
      interaction,
      [author, ...uniqueOpponents],
      exp,
      gold,
      player1_data,
      author
    )
    await battle.run()
  },
}
