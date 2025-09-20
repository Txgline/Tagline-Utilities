const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('itunes')
    .setDescription('Get information about a song from iTunes.')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Enter the name of the song')
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const query = interaction.options.getString('song');
    await interaction.deferReply();

    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        return interaction.editReply({ content: '❌ No results found for that song.' });
      }

      const song = data.results[0];

      const embed = new EmbedBuilder()
        .setTitle(song.trackName)
        .setURL(song.trackViewUrl)
        .setAuthor({ name: song.artistName, url: song.artistViewUrl })
        .setThumbnail(song.artworkUrl100)
        .setColor('Random')
        .addFields(
          { name: '🎤 Artist', value: song.artistName, inline: true },
          { name: '💿 Album', value: song.collectionName, inline: true },
          { name: '🕒 Duration', value: `${Math.floor(song.trackTimeMillis / 60000)}:${String(Math.floor((song.trackTimeMillis % 60000) / 1000)).padStart(2, '0')} min`, inline: true },
          { name: '📅 Release Date', value: new Date(song.releaseDate).toDateString(), inline: true },
          { name: '🎶 Genre', value: song.primaryGenreName, inline: true },
          { name: '🌍 Country', value: song.country, inline: true }
        )
        .setFooter({ text: `Provided by iTunes` });

      return interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      return interaction.editReply({ content: '❌ An error occurred while fetching song info.' });
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
