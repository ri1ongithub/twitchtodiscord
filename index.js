const tmi = require('tmi.js');
const Discord = require('discord.js');
const dsc = new Discord.Client();
const config = require('./config.json');

dsc.on('ready', () => {
  console.log(`[DISCORD] Connecté avec ${dsc.user.tag} !`);
});


dsc.on('message', msg => {
  if (msg.content === '!ping') {
    msg.reply('Pong!');
  }
});

const client = new tmi.Client({
	options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: config.twitch_bot_username,
		password: config.twitch_bot_token
	},
	channels: [ config.twitch_channel ]
});

client.connect();

dsc.on('message', msg => {
	if (msg.channel.id === config.discord_channel) {
		if(msg.author.bot) return;
		client.say(config.twitch_channel, `[Discord] ${msg.author.username} » ${msg}`);
}
})


client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	const dschannel = dsc.channels.cache.find(channel => channel.id === config.discord_channel)
dschannel.send(`[Twitch] ${tags.username} » ${message}`);

	if(message.toLowerCase() === '!ping') {
		// "@alca, heya!"
		client.say(channel, `@${tags.username}, pong!`);
	}
});

dsc.login(config.discord_token);