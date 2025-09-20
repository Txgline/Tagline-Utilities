const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(false)
    ),

  async execute(interaction) {
    const executor = interaction.member;
    const bot = interaction.guild.members.me;
    const targetUser = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    // --- Permission checks ---
    if (!executor.permissions.has(PermissionFlagsBits.BanMembers))
      return interaction.reply({ content: '🚫 You do not have permission to ban members.', ephemeral: true });
    if (!bot.permissions.has(PermissionFlagsBits.BanMembers))
      return interaction.reply({ content: '❌ I do not have permission to ban members.', ephemeral: true });
    if (!targetMember)
      return interaction.reply({ content: '⚠️ That user is not in the server.', ephemeral: true });
    if (targetUser.id === interaction.user.id)
      return interaction.reply({ content: '🙃 You cannot ban yourself.', ephemeral: true });
    if (targetUser.id === bot.id)
      return interaction.reply({ content: '🤖 I cannot ban myself.', ephemeral: true });
    if (targetUser.id === interaction.guild.ownerId)
      return interaction.reply({ content: '🚫 You cannot ban the server owner.', ephemeral: true });
    if (targetMember.roles.highest.position >= executor.roles.highest.position && interaction.guild.ownerId !== executor.id)
      return interaction.reply({ content: '🔒 You cannot ban someone with an equal or higher role than you.', ephemeral: true });
    if (!targetMember.bannable)
      return interaction.reply({ content: '❗ I cannot ban that user. They may have a higher role than me.', ephemeral: true });

    // --- DM the user ---
    try {
      await targetUser.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`You have been banned from ${interaction.guild.name}`)
            .setDescription(`Reason: ${reason}`)
            .setColor('Red')
            .setTimestamp()
        ]
      });
    } catch (err) {
      console.log(`Could not DM ${targetUser.tag}. They might have DMs closed.`);
    }

    // --- Ban user ---
    await targetMember.ban({ reason });

    // --- Reply in command channel ---
    const embed = new EmbedBuilder()
      .setTitle('Member Banned')
      .setColor('Red')
      .addFields(
        { name: 'User', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
        { name: 'By', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setFooter({ text: `Banned by System • ${new Date().toLocaleString()}` });

    await interaction.reply({ embeds: [embed] });

    // --- Send to mod logs ---
    const logsChannel = interaction.guild.channels.cache.get(config.modLogsChannelId);
    if (logsChannel) {
      const logEmbed = new EmbedBuilder()
        .setTitle('🚨 Ban Logs')
        .setColor('DarkRed')
        .addFields(
          { name: 'Banned User', value: `${targetUser.tag} (${targetUser.id})` },
          { name: 'Executor', value: `${interaction.user.tag} (${interaction.user.id})` },
          { name: 'Reason', value: reason },
          { name: 'Date', value: new Date().toLocaleString() }
        );
      logsChannel.send({ embeds: [logEmbed] });
    }
  }
};
