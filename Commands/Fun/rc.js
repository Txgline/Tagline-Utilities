const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomcolor')
    .setDescription('Generates a random color with preview'),

  async execute(interaction) {
    // Generate a random hex color
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const hexColor = `#${randomColor}`;

    const embed = new EmbedBuilder()
      .setTitle('🎨 Random Color Generator')
      .setDescription(`**HEX Code:** \`${hexColor.toUpperCase()}\``)
      .setColor(`#${randomColor}`)
      .setImage(`https://singlecolorimage.com/get/${randomColor}/600x200`)
      .setFooter({ text: 'colorchoice' });

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
