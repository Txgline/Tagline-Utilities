const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Shows the total member count of the server.')
    .setDMPermission(false),

  async execute(interaction) {
    const guild = interaction.guild;

    await guild.members.fetch(); // Ensures accurate counting

    const total = guild.memberCount;
    const humans = guild.members.cache.filter(m => !m.user.bot).size;
    const bots = guild.members.cache.filter(m => m.user.bot).size;

    const embed = new EmbedBuilder()
      .setTitle('📊 Member Count')
      .setColor('Blurple')
      .addFields(
        { name: 'Total Members', value: `${total}`, inline: true },
        { name: 'Humans', value: `${humans}`, inline: true },
        { name: 'Bots', value: `${bots}`, inline: true },
      )
      .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
