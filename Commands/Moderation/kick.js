const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config.json'); // make sure path is correct

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The member to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick')
        .setRequired(false)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);

    // --- Permission Checks ---
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: '❌ I do not have permission to kick members.', ephemeral: true });
    }

    if (!member) {
      return interaction.reply({ content: '❌ The specified user is not in this server.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: '❌ I cannot kick this user. They may have higher permissions than me.', ephemeral: true });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot kick yourself.', ephemeral: true });
    }

    // --- DM the user ---
    try {
      await target.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`You have been kicked from ${interaction.guild.name}`)
            .setDescription(`Reason: ${reason}`)
            .setColor('Orange')
            .setTimestamp()
        ]
      });
    } catch (err) {
      console.log(`Could not DM ${target.tag}. They might have DMs closed.`);
    }

    // --- Kick the member ---
    await member.kick(reason);

    // --- Reply in command channel ---
    const embed = new EmbedBuilder()
      .setTitle('👢 Member Kicked')
      .setColor('Red')
      .addFields(
        { name: 'User', value: `${target.tag}`, inline: true },
        { name: 'Kicked by', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // --- Send to unified mod logs channel ---
    const logsChannel = interaction.guild.channels.cache.get(config.modLogsChannelId);
    if (logsChannel) {
      const logEmbed = new EmbedBuilder()
        .setTitle('🚨 Kick Logs')
        .setColor('Orange')
        .addFields(
          { name: 'Kicked User', value: `${target.tag} (${target.id})` },
          { name: 'Executor', value: `${interaction.user.tag} (${interaction.user.id})` },
          { name: 'Reason', value: reason },
          { name: 'Date', value: new Date().toLocaleString() }
        );
      logsChannel.send({ embeds: [logEmbed] });
    }
  },
};
