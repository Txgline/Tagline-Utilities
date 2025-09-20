const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Removes mute from a member.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to unmute')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unmuting')
        .setRequired(false)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);

    // Permission check
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return interaction.reply({ content: '❌ You do not have permission to unmute members.', ephemeral: true });
    }

    if (!member) {
      return interaction.reply({ content: '❌ Member not found in this server.', ephemeral: true });
    }

    if (!member.communicationDisabledUntilTimestamp) {
      return interaction.reply({ content: '❌ That user is not muted.', ephemeral: true });
    }

    try {
      await member.timeout(null, reason);

      // Reply to executor
      await interaction.reply({
        content: `✅ <@${member.id}> has been unmuted.\n**Reason:** ${reason}`,
        allowedMentions: { users: [] }
      });

      // Send log to mod logs channel
      const logsChannel = interaction.guild.channels.cache.get(config.modLogsChannelId);
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('🔈 Member Unmuted')
          .setColor('Green')
          .addFields(
            { name: 'User', value: `${member.user.tag} (${member.id})` },
            { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})` },
            { name: 'Reason', value: reason },
            { name: 'Date', value: new Date().toLocaleString() }
          );
        logsChannel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      console.error('Unmute Error:', error);
      return interaction.reply({
        content: '❌ Failed to unmute the user. Do I have the correct permissions and role hierarchy?',
        ephemeral: true
      });
    }
  }
};
