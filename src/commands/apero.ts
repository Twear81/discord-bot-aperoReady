import { SlashCommandBuilder, MessageFlags, EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageComponentInteraction, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, GuildScheduledEventCreateOptions, TextChannel } from 'discord.js';
import dayjs from 'dayjs';
import { setupLocation } from '../helper/apero_location';
import { setupConfirmation } from '../helper/apero_confirmation';
require('dayjs/locale/fr')
dayjs.locale('fr')

export const data = new SlashCommandBuilder()
	.setName('apero')
	.setDescription('Setup un apero pour le vendredi qui arrive');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
	try {
		let aperoDateObject = dayjs().startOf('week').add(4, 'day').add(20, 'hour');
		const isPastFriday = dayjs().isAfter(aperoDateObject);
		if (isPastFriday == true) {
			aperoDateObject = aperoDateObject.add(1, 'week');
		}

		const locationResponse = await setupLocation(interaction, aperoDateObject);

		const location: MessageComponentInteraction = await locationResponse.awaitMessageComponent({ time: 60_000 });

		let locationResult = (location as any).values[0];

		let eventDiscord: GuildScheduledEventCreateOptions = {
			name: `Apéro du vendredi chez ${locationResult} 🍻`,
			description: `Rejoignez-nous pour un apéro chez **${locationResult}** vendredi soir ! 🍹`,
			scheduledStartTime: aperoDateObject.toDate(),
			scheduledEndTime: aperoDateObject.add(2, 'hour').toDate(),
			privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly, // Visible uniquement par les membres du serveur
			entityType: GuildScheduledEventEntityType.External, // Peut être Voice, StageInstance ou External
			entityMetadata: { location: locationResult }
		};

		if (locationResult == "restorant") {
			// Changer le message "location" pour laisser rentrer une adresse google maps
			await interaction.followUp({ content: "🍽 Tu as choisi **Restaurant**. Envoie-moi l'adresse Google Maps du lieu dans les **60 secondes**.", ephemeral: true });

			let adresse: string | undefined = undefined;
			try {
				const filter = (msg: any) => msg.author.id === interaction.user.id;
				const collected = await (interaction.channel as TextChannel).awaitMessages({ filter, max: 1, time: 60_000, errors: ["time"] });
				adresse = collected.first()?.content || "";

				if (!adresse.startsWith("http")) {
					interaction.followUp({ content: "❌ Adresse invalide ! Envoie un **lien Google Maps valide**.", ephemeral: true });
				}

				// Mise à jour de l'événement pour un mode "Externe"
				eventDiscord.name = `Apéro du vendredi au restaurant 🍻`;
				eventDiscord.description = `Rejoignez-nous pour un apéro au restaurant ! 🍹\n📍 **Lieu** : [Google Maps](${adresse})`;
				eventDiscord.entityType = GuildScheduledEventEntityType.External;
				eventDiscord.entityMetadata = { location: adresse };
			} catch (error) {
				await interaction.followUp({ content: "⏳ Temps écoulé ! L'événement n'a pas été créé.", ephemeral: true });
			}


			eventDiscord.entityMetadata = { location: adresse }; // Définition de l'adresse
		}

		const event = await interaction.guild!.scheduledEvents.create(eventDiscord);

		const confirmationResponse = await setupConfirmation(location, aperoDateObject, locationResult);
		// Event manager to get the response from the user after the button click
		const collector = confirmationResponse.createMessageComponentCollector({ time: 3_600_000 });
		collector.on('collect', async interaction => {
			const selection = interaction.customId;
			if (selection === "confirm") {
				await interaction.reply({ content: `${interaction.user.username} vient pour l'apero !`, ephemeral: true });
			} else if (selection === "deny") {
				await interaction.reply({ content: `${interaction.user.username} ne vient pas pour l'apero !`, ephemeral: true });
			}
		});

	} catch (e) {
		console.log(e);
		await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
	}
}