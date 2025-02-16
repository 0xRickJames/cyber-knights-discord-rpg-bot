# Cyber Knights Discord RPG Bot

## Description

This is a simple RPG Discord bot built using Node.js and the Discord.js library. The bot allows users to play an embed based RPG game, in which they can purcahse items, battle others in the server, and fight boss battles (with or without others from the server).

## Installation

To get started with the RPG Discord bot, follow these steps:

1. Clone this repository to your local machine:
   `git clone https://github.com/0xRickJames/cyber-knights-discord-rpg-bot`

2. Navigate to the project directory:

`cd cyber-knight-discord-rpg-bot`

3. Install the required Node.js packages using npm:

`npm install`

## Configuration

Before running the bot, you need to set up your Discord bot token and other configuration options:

1. Create a new Discord bot and obtain your bot token. You can do this by following the official Discord Developer documentation.

2. Create a `.env` file in the project root directory and add the following configuration:
   `BOT_TOKEN="Your Discord Bot Token"
MONGO_URI="Your MongoDB URI"`

Replace `Your Discord Bot Token` and `Your MongoDB URI` with your actual Discord bot token and MongoDB URI.

## Usage

Once you've configured the bot, you can build and start it using npm:
`npm run build
npm start`

Add the bot to your Discord server and ensure that it has permissions to see and create messages.

## Commands

Go to https://www.nme-bot.info/ to view all of the RPG bot commands and how to use them

## Contributing

If you'd like to contribute to this project, please fork the repository and create a pull request with your changes. We welcome any improvements, bug fixes, or new features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the Discord.js library for making it easy to create Discord bots.
- Thanks to https://github.com/issadarkthing for sharing https://github.com/issadarkthing/discordjs-rpg
