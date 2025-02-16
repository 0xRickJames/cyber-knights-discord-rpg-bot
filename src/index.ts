import { Client, GatewayIntentBits } from 'discord.js'
import { connectDatabase } from './database/connectDatabase'
import { onInteraction } from './events/onInteraction'
import { onReady } from './events/onReady'
import 'dotenv/config'

;(async () => {
  const BOT = new Client({ intents: GatewayIntentBits.Guilds })

  BOT.on('ready', async () => await onReady(BOT))

  BOT.on(
    'interactionCreate',
    async (interaction: any) => await onInteraction(interaction)
  )

  await connectDatabase()

  await BOT.login(process.env.BOT_TOKEN)
})()
