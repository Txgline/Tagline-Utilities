const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('space')
    .setDescription('Get live info about the International Space Station and astronauts in space.')
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      // Get ISS Position
      const issPositionRes = await axios.get('http://api.open-notify.org/iss-now.json');
      const lat = issPositionRes.data.iss_position.latitude;
      const lon = issPositionRes.data.iss_position.longitude;

      // Get People in Space
      const peopleRes = await axios.get('http://api.open-notify.org/astros.json');
      const people = peopleRes.data.people;
      const issPeople = people.filter(p => p.craft === 'ISS');
      const astronauts = issPeople.map(p => `• ${p.name}`).join('\n') || 'No one onboard';

      // Get ISS altitude & speed (via another reliable public API)
      const issExtended = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
      const altitude = (issExtended.data.altitude).toFixed(2); // in km
      const velocity = (issExtended.data.velocity).toFixed(2); // in km/h

      const embed = new EmbedBuilder()
        .setTitle('🛰 International Space Station (ISS) Live Info')
        .setColor('DarkBlue')
        .addFields(
          { name: '🌍 Latitude', value: `\`${lat}\``, inline: true },
          { name: '🌍 Longitude', value: `\`${lon}\``, inline: true },
          { name: '🗺 Map Location', value: `[View on Map](https://www.openstreetmap.org/#map=4/${lat}/${lon})` },
          { name: '📏 Altitude', value: `\`${altitude} km\``, inline: true },
          { name: '💨 Speed', value: `\`${velocity} km/h\``, inline: true },
          { name: '👨‍🚀 People Aboard ISS', value: `\`${issPeople.length}\``, inline: true },
          { name: '🧑‍🚀 Astronauts Aboard', value: astronauts }
        )
        .setFooter({ text: 'Live data from open-notify.org & wheretheiss.at' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      await interaction.editReply({ content: '❌ Could not fetch space data. Try again later.' });
    }
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
