
import { CacheType, ChatInputCommandInteraction, Client, GatewayIntentBits } from "discord.js";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import dotenv from 'dotenv';

dotenv.config();
export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

client.once("ready", async () => {
	console.log("Discord bot is ready! 🤖");
	// await deployCommands({ guildId: "1343307832853925948" });
});

client.on("guildCreate", async (guild) => {
	await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) {
		console.error(`No command matching ${interaction.valueOf()} was found.`);
		return;
	}
	const { commandName } = interaction;
	if (commands[commandName as keyof typeof commands]) {
		commands[commandName as keyof typeof commands].execute(interaction as ChatInputCommandInteraction<CacheType>);
	}
});

client.login(process.env.DISCORD_TOKEN);