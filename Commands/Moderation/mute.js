const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const config = require('../../config.json'); // adjust path if needed

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Temporarily mute a member in the server.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to mute')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Mute duration (e.g., 1m, 10m, 1h, 1d)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the mute')
        .setRequired(false)
    )
    .setDMPermission(false),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({
        content: '❌ You do not have permission to use this command.',
        ephemeral: true
      });
    }

    const target = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(target.id);
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const time = ms(duration);

    if (!time || time < 1000 || time > 28 * 24 * 60 * 60 * 1000) {
      return interaction.reply({
        content: '❌ Invalid duration. Must be between 1 second and 28 days.',
        ephemeral: true,
      });
    }

    if (!member || !member.moderatable || member.id === interaction.user.id || member.id === interaction.client.user.id) {
      return interaction.reply({ content: '❌ You can’t mute this user.', ephemeral: true });
    }

    try {
      // --- DM the user ---
      try {
        await target.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`You have been muted in ${interaction.guild.name}`)
              .setDescription(`Duration: ${duration}\nReason: ${reason}`)
              .setColor('Orange')
              .setTimestamp()
          ]
        });
      } catch (err) {
        console.log(`Could not DM ${target.tag}. They might have DMs closed.`);
      }

      // --- Apply timeout ---
      await member.timeout(time, reason);

      await interaction.reply({
        content: `✅ <@${member.id}> has been muted for **${duration}**.\n**Reason:** ${reason}`,
        allowedMentions: { users: [] },
      });

      // --- Send to logs channel ---
      const logsChannel = interaction.guild.channels.cache.get(config.modLogsChannelId);
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('🔇 Member Muted')
          .setColor('Orange')
          .addFields(
            { name: 'User', value: `${member.user.tag} (${member.id})` },
            { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})` },
            { name: 'Duration', value: duration },
            { name: 'Reason', value: reason },
            { name: 'Date', value: new Date().toLocaleString() }
          );
        logsChannel.send({ embeds: [logEmbed] });
      }

    } catch (err) {
      console.error('Mute Error:', err);
      return interaction.reply({
        content: '❌ Failed to mute the member. Check permissions and role position.',
        ephemeral: true,
      });
    }
  }
};
