const { ComponentType, GuildScheduledEventManager, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const dayjs = require('dayjs')
require('dayjs/locale/fr')
dayjs.locale('fr')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('apero')
		.setDescription('Permet de setup un apero pour le vendredi qui arrive'),
	async execute(interaction) {

		// Setup the location selector for the discord message
		const selectLocation = new StringSelectMenuBuilder()
			.setCustomId('location')
			.setPlaceholder('Chez qui ?')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Latge')
					.setDescription('Le financier')
					.setValue('latge'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Lucas')
					.setDescription('Le techos')
					.setValue('lucas'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Anthony')
					.setDescription("L'ingenieur")
					.setValue('anthony'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Restorant')
					.setDescription("Il est bon j'espere")
					.setValue('restorant'),
			);
		const locationSlectorRow = new ActionRowBuilder()
			.addComponents([selectLocation]);


		// Get the next friday
		// TODO check after friday to pick the next friday of the next week
		const aperoDateObject = dayjs().startOf('week').add(4, 'day').add(20, 'hour');

		// Setup the button layout for the discord message
		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Apero !')
			.setStyle(ButtonStyle.Success);
		const deny = new ButtonBuilder()
			.setCustomId('deny')
			.setLabel('Pas la')
			.setStyle(ButtonStyle.Danger);
		const buttonRow = new ActionRowBuilder()
			.addComponents([confirm, deny]);

		
		const response = await interaction.reply({
			content: "Es tu dispo ce " + aperoDateObject.format("dddd DD MMMM") + " a " + aperoDateObject.format("HH:mm") + " ?",
			components: [buttonRow]
		});

		const collectorFilter = i => i.type === 3;
		try {
			// Event manager to get the response from the user after the button click
			const collector = response.createMessageComponentCollector({ componentType: ComponentType.ButtonBuilder, time: 3_600_000 });
			collector.on('collect', async i => {
				const selection = i.customId;
				if (selection === "confirm") {
					await i.reply(`${i.user.username} vient pour l'apero !`);
				} else if (selection === "deny") {
					await i.reply(`${i.user.username} ne vient pas pour l'apero !`);
				}
			});
		} catch (e) {
			await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
		}
	},
};
