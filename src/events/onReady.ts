import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10' // Updated to v10
import { Client } from 'discord.js'
import { CommandList } from '../commands/_CommandList'

export const onReady = async (BOT: Client) => {
  console.log(`Logged in as ${BOT.user?.tag}`)

  const rest = new REST({ version: '10' }).setToken(
    process.env.BOT_TOKEN as string
  )

  try {
    console.log('Registering slash commands...')

    const commandData = CommandList.map((command) => command.data.toJSON())

    await rest.put(Routes.applicationCommands(BOT.user!.id), {
      body: commandData,
    })

    console.log('Successfully registered all commands.')
  } catch (error) {
    console.error('Error registering commands:', error)
  }

  console.log('RPG Bot Online!')
}
