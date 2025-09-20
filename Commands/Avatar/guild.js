const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guild')
    .setDescription("Get the user's server-specific avatar")
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

    if (!member || !member.avatar) {
      return interaction.reply({ content: '❌ This user does not have a guild avatar.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s Guild Avatar`)
      .setImage(member.displayAvatarURL({ extension: 'png', size: 1024 }))
      .setColor('Green');

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
