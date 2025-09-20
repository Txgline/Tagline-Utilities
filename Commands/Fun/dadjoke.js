const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dadjoke')
    .setDescription('Get a random dad joke'),

  async execute(interaction) {
    https.get('https://icanhazdadjoke.com/', {
      headers: { Accept: 'application/json' }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => { data += chunk; });
      res.on('end', async () => {
        try {
          const jokeData = JSON.parse(data);

          const embed = new EmbedBuilder()
            .setTitle('🤣 Dad Joke')
            .setDescription(jokeData.joke)
            .setColor('Orange')
            .setFooter({ text: 'Sourced from icanhazdadjoke.com' });

          await interaction.reply({ embeds: [embed] });
        } catch (err) {
          console.error('Joke parse error:', err);
          await interaction.reply({ content: '❌ Could not fetch a joke.', ephemeral: true });
        }
      });
    }).on('error', async (err) => {
      console.error('HTTP Error:', err);
      await interaction.reply({ content: '❌ Failed to fetch a dad joke.', ephemeral: true });
    });
  },
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
