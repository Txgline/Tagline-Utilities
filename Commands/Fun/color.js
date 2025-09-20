const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const tinycolor = require('tinycolor2');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('color')
    .setDescription('Shows info about a color')
    .addStringOption(option =>
      option.setName('value')
        .setDescription('Color name or hex code (e.g. red or #ff0000)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString('value');
    const color = tinycolor(input);

    if (!color.isValid()) {
      return interaction.reply({ content: '❌ Invalid color name or hex code.', ephemeral: true });
    }

    const hex = color.toHexString();
    const rgb = color.toRgb();
    const name = tinycolor.equals(hex, tinycolor(hex).toName()) ? tinycolor(hex).toName() : 'N/A';

    const embed = new EmbedBuilder()
      .setTitle('🎨 Color Info')
      .setDescription(`**Name:** ${name}\n**Hex:** \`${hex}\`\n**RGB:** \`${rgb.r}, ${rgb.g}, ${rgb.b}\``)
      .setImage(`https://singlecolorimage.com/get/${hex.replace('#', '')}/600x200`)
      .setColor(hex)
      .setFooter({ text: 'Color info' });

    interaction.reply({ embeds: [embed] });
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
