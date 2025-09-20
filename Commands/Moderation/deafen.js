const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config.json'); // make sure the path is correct

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deafen')
    .setDescription('Deafen a user in a voice channel')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to deafen')
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const target = interaction.options.getMember('target');

    // --- Permission checks ---
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.DeafenMembers)) {
      return interaction.reply({ content: '❌ I need the **Deafen Members** permission!', ephemeral: true });
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: '❌ You need the **Moderate Members** permission!', ephemeral: true });
    }

    if (!target.voice || !target.voice.channel) {
      return interaction.reply({ content: '❌ That user is not in a voice channel.', ephemeral: true });
    }

    try {
      await target.voice.setDeaf(true);
      await interaction.reply(`✅ **${target.user.tag}** has been deafened.`);

      // --- Send log to mod logs channel ---
      const logsChannel = interaction.guild.channels.cache.get(config.modLogsChannelId);
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('🔇 Member Deafened')
          .setColor('DarkBlue')
          .addFields(
            { name: 'User', value: `${target.user.tag} (${target.id})` },
            { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})` },
            { name: 'Date', value: new Date().toLocaleString() }
          );
        logsChannel.send({ embeds: [logEmbed] });
      }

    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to deafen the user. Do I have enough permissions?', ephemeral: true });
    }
  },
};
