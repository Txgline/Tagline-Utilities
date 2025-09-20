const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Sends a random cute cat picture 🐱'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search');
      const catImage = response.data[0]?.url;

      if (!catImage) {
        return interaction.editReply('❌ Could not fetch a cat image right now. Try again later!');
      }

      const embed = {
        title: '🐱 Meow!',
        image: {
          url: catImage
        },
        color: 0xFFC0CB,
        footer: {
          text: 'A cute cat picture for you!'
        }
      };

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error fetching cat image:', error);
      await interaction.editReply('❌ Failed to get a cat image. Please try again later!');
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
