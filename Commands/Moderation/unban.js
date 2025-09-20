const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const UNBAN_LOGS_CHANNEL_ID = "1113354227083907117"; // Replace with your logs channel ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server.')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('The ID of the user to unban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unbanning the user')
        .setRequired(false)
    )
    .setDMPermission(false),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: '❌ You do not have permission to unban members.', ephemeral: true });
    }

    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    try {
      const banList = await interaction.guild.bans.fetch();
      const bannedUser = banList.get(userId);

      if (!bannedUser) {
        return interaction.reply({ content: `❌ User with ID \`${userId}\` is not banned.`, ephemeral: true });
      }

      await interaction.guild.members.unban(userId, reason);

      const embed = new EmbedBuilder()
        .setTitle('🔓 User Unbanned')
        .setColor('Green')
        .addFields(
          { name: 'User ID', value: `\`${userId}\`` },
          { name: 'Reason', value: reason }
        )
        .setFooter({ text: `Unbanned by ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      // --- Send to logs channel ---
      const logsChannel = interaction.guild.channels.cache.get(UNBAN_LOGS_CHANNEL_ID);
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('🚨 Unban Logs')
          .setColor('Green')
          .addFields(
            { name: 'Unbanned User ID', value: `\`${userId}\`` },
            { name: 'Executor', value: `${interaction.user.tag} (${interaction.user.id})` },
            { name: 'Reason', value: reason },
            { name: 'Date', value: new Date().toLocaleString() }
          );
        logsChannel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Failed to unban the user. Check the ID and try again.', ephemeral: true });
    }
  }
};
