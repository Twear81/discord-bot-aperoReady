import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChatInputCommandInteraction, InteractionCallbackResponse, Message, InteractionResponse } from 'discord.js';
import dayjs from 'dayjs';
require('dayjs/locale/fr')
dayjs.locale('fr')


export const setupLocation = async (interaction: ChatInputCommandInteraction, dateObject: dayjs.Dayjs) => {
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
    const locationSlectorRow = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectLocation);

    return await interaction.reply({
        content: "Ou mange/bois t'on le " + dateObject.format("dddd DD MMMM") + " a " + dateObject.format("HH:mm") + " ?",
        components: [locationSlectorRow]
    });
}