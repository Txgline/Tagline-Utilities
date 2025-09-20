const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription("Get both the user's global and server avatar")
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Select a user')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!user) {
      return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s Avatars`)
      .addFields(
        { name: 'User Avatar', value: `[Click Here](${user.displayAvatarURL({ extension: 'png', size: 1024 })})`, inline: true },
        { name: 'Guild Avatar', value: member?.avatar ? `[Click Here](${member.displayAvatarURL({ extension: 'png', size: 1024 })})` : 'No guild avatar set.', inline: true }
      )
      .setImage(member?.avatar
        ? member.displayAvatarURL({ extension: 'png', size: 1024 })
        : user.displayAvatarURL({ extension: 'png', size: 1024 }))
      .setColor('Blurple');

    return interaction.reply({ embeds: [embed] });
  }
};

/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
