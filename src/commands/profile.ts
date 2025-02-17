import {
  SlashCommandBuilder,
  User,
  ChatInputCommandInteraction,
} from 'discord.js'
import { Command } from '../interfaces/Command'
import { powerUpCheck } from '../modules/powerUpCheck'

export const profile: Command = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("Check character's stats")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('View the profile of this user')
        .setRequired(false)
    ) as SlashCommandBuilder, // Explicit cast here
  run: async (interaction: ChatInputCommandInteraction) => {
    const player = interaction.options.getUser('user') ?? interaction.user
    const member = interaction.guild?.members.cache.get(player.id)
    const fighter = await powerUpCheck(member!, player.id)
    await interaction.reply({ embeds: [fighter.show()] })
  },
}
