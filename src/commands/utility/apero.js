const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('apero')
		.setDescription('Permet de setup un apero pour le venrededi qui arrive'),
	async execute(interaction) {
		await interaction.reply('Apero !');
	},
};
