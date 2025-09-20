const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin and returns Heads or Tails!')
    .setDMPermission(false),

  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

    const embed = new EmbedBuilder()
      .setTitle('🪙 Coin Flip Result')
      .setDescription(`The coin landed on **${result}**!`)
      .setColor(result === 'Heads' ? 0xFFD700 : 0x808080) 
      .setFooter({ text: 'Coinflip' })
      .setTimestamp();

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
