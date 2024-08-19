const { ComponentType, GuildScheduledEventManager, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const dayjs = require('dayjs')
require('dayjs/locale/fr')
dayjs.locale('fr')
const aperoLocation = require('../helper/apero_location');
const aperoConfirmation = require('../helper/apero_confirmation');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('apero')
		.setDescription('Permet de setup un apero pour le vendredi qui arrive'),
	async execute(interaction) {
		// Get the next friday
		// TODO check after friday to pick the next friday of the next week
		const aperoDateObject = dayjs().startOf('week').add(4, 'day').add(20, 'hour');

		const locationResponse = await aperoLocation.setupLocation(interaction, aperoDateObject);
		let locationResult = "";
		try {
			const location = await locationResponse.awaitMessageComponent({ time: 60_000 });
			locationResult = location.values[0];

			const confirmationResponse = await aperoConfirmation.setupConfirmation(location, aperoDateObject, locationResult);
			// Event manager to get the response from the user after the button click
			const collector = confirmationResponse.createMessageComponentCollector({ time: 3_600_000 });
			collector.on('collect', async i => {
				const selection = i.customId;
				if (selection === "confirm") {
					await i.reply({ content: `${i.user.username} vient pour l'apero !`, ephemeral: true });
				} else if (selection === "deny") {
					await i.reply({ content: `${i.user.username} ne vient pas pour l'apero !`, ephemeral: true });
				}
			});
		} catch (e) {
			console.log(e);
			await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
		}
	},
};
