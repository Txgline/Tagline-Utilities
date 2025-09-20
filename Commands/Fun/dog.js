const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Get a cute dog picture!')
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply();

    https.get('https://dog.ceo/api/breeds/image/random', (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const dogImage = json.message;

          const embed = new EmbedBuilder()
            .setTitle('🐶 Woof!')
            .setImage(dogImage)
            .setColor('Random')
            .setFooter({ text: 'Rate it /10' });

          interaction.editReply({ embeds: [embed] });
        } catch (error) {
          interaction.editReply('❌ Failed to fetch a dog image.');
        }
      });
    }).on('error', () => {
      interaction.editReply('❌ Could not connect to the dog image service.');
    });
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
