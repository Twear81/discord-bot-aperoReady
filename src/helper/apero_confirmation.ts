import { ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageComponentInteraction, StringSelectMenuBuilder } from 'discord.js';
import dayjs from 'dayjs';
require('dayjs/locale/fr')
dayjs.locale('fr')

export const setupConfirmation = async (location: MessageComponentInteraction, dateObject: dayjs.Dayjs, locationResult: string) => {
    // Setup the button layout for the discord message
    const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Apero !')
        .setStyle(ButtonStyle.Success);
    const deny = new ButtonBuilder()
        .setCustomId('deny')
        .setLabel('Pas la')
        .setStyle(ButtonStyle.Danger);
    const buttonRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([confirm, deny]);

    const locationMessage = locationResult === "restorant" ? "au resto" : "chez " + locationResult;

    return await location.update({
        content: "Es tu dispo ce " + dateObject.format("dddd DD MMMM") + " a " + dateObject.format("HH:mm") + " " + locationMessage + " ?",
        components: [buttonRow]
    });
}