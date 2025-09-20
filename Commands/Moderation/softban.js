const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config.json'); // Make sure path is correct

module.exports = {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Softbans a user (ban and immediately unban to delete messages)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to softban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for softban')
        .setRequired(false))
    .setDMPermission(false),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(user.id);

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return interaction.reply({ content: '❌ You need the `Ban Members` permission to use this command.', ephemeral: true });
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers))
      return interaction.reply({ content: '❌ I need the `Ban Members` permission to perform this action.', ephemeral: true });
    if (!member)
      return interaction.reply({ content: '❌ That user is not in this server.', ephemeral: true });
    if (member.id === interaction.user.id)
      return interaction.reply({ content: '❌ You cannot softban yourself.', ephemeral: true });
    if (interaction.member.roles.highest.position <= member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId)
      return interaction.reply({ content: '❌ You cannot softban a member with equal or higher role.', ephemeral: true });

    try {
      // Softban
      await member.ban({ days: 7, reason });
      await interaction.guild.members.unban(user.id, 'Softban unban');

      const embed = new EmbedBuilder()
        .setTitle('✅ Softbanned Member')
        .setDescription(`**${user.tag}** has been softbanned.\n**Reason:** ${reason}`)
        .setColor('Red')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      // Unified mod logs channel
      const logsChannel = interaction.guild.channels.cache.get(config.modLogsChannelId);
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('🚨 Softban Logs')
          .setColor('DarkRed')
          .addFields(
            { name: 'Softbanned User', value: `${user.tag} (${user.id})` },
            { name: 'Executor', value: `${interaction.user.tag} (${interaction.user.id})` },
            { name: 'Reason', value: reason },
            { name: 'Date', value: new Date().toLocaleString() }
          );
        logsChannel.send({ embeds: [logEmbed] });
      }

    } catch (err) {
      console.error(err);
      return interaction.reply({ content: '❌ Failed to softban the member.', ephemeral: true });
    }
  }
};
