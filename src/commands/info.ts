import { EmbedBuilder } from '@discordjs/builders'
import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '../interfaces/Command'

export const info: Command = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Post info about RPG Bot'),

  run: async (interaction) => {
    let member = interaction.member as GuildMember

    if (
      member.roles.cache.has('1039934064376938637') ||
      member.user.id === '267142718856101889'
    ) {
      const embed = new EmbedBuilder()
        .setTitle('Cyber Knights RPG Bot')
        .setColor([0 / 255.0, 0 / 255.0, 255 / 255.0])
        .setDescription(
          'Battle your friends, Defeat powerful bosses, Buy and upgrade equipment!\n📖 Game Manual here --> https://nme-bot.info/'
        )

      interaction.reply({ embeds: [embed] })
    } else {
      await interaction.reply({
        content: 'Access to this command is limited!',
        ephemeral: true,
      })
    }
  },
}
