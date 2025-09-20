const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('distance')
    .setDescription('Calculate the distance between two coordinates.')
    .addStringOption(option =>
      option.setName('cord1')
        .setDescription('First coordinates (e.g., 28.6139,77.2090)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('cord2')
        .setDescription('Second coordinates (e.g., 19.0760,72.8777)')
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const cord1 = interaction.options.getString('cord1');
    const cord2 = interaction.options.getString('cord2');

    const [lat1, lon1] = cord1.split(',').map(Number);
    const [lat2, lon2] = cord2.split(',').map(Number);

    if (
      isNaN(lat1) || isNaN(lon1) ||
      isNaN(lat2) || isNaN(lon2)
    ) {
      return interaction.reply({
        content: '❌ Invalid coordinates. Please use the format: `latitude,longitude`',
        ephemeral: true
      });
    }

    const R = 6371; // Earth's radius in kilometers
    const toRad = deg => deg * (Math.PI / 180);

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceKm = (R * c).toFixed(2);
    const distanceMi = (distanceKm * 0.621371).toFixed(2);

    const embed = new EmbedBuilder()
      .setTitle('📏 Distance Calculator')
      .setDescription(`Here is the distance between the two coordinates:`)
      .addFields(
        { name: '📍 From', value: `\`${lat1}, ${lon1}\``, inline: true },
        { name: '📍 To', value: `\`${lat2}, ${lon2}\``, inline: true },
        { name: '🛣️ Distance', value: `${distanceKm} km (${distanceMi} mi)` }
      )
      .setColor('Random');

    await interaction.reply({ embeds: [embed] });
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
