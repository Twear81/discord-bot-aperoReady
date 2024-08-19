const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const dayjs = require('dayjs')
require('dayjs/locale/fr')
dayjs.locale('fr')

const setupConfirmation = async function (location, dateObject, locationResult) {
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

    const locationMessage = locationResult === "restorant" ? "au resto" : "chez " + locationResult;

    return response = await location.update({
        content: "Es tu dispo ce " + dateObject.format("dddd DD MMMM") + " a " + dateObject.format("HH:mm") + " " + locationMessage + " ?",
        components: [buttonRow]
    });
}



module.exports = { setupConfirmation, ...module.exports }