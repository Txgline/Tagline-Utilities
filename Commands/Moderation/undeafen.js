const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('undeafen')
    .setDescription('Undeafen a user in a voice channel')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to undeafen')
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const target = interaction.options.getMember('target');

    // Bot permission check
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.DeafenMembers)) {
      return interaction.reply({
        content: '❌ I need the **Deafen Members** permission to undeafen users!',
        ephemeral: true
      });
    }

    // User permission check
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: '❌ You need the **Moderate Members** permission to use this command!',
        ephemeral: true
      });
    }

    // Check if the target is in a voice channel
    if (!target.voice || !target.voice.channel) {
      return interaction.reply({
        content: '❌ That user is not in a voice channel.',
        ephemeral: true
      });
    }

    try {
      await target.voice.setDeaf(false);
      await interaction.reply(`✅ **${target.user.tag}** has been undeafened.`);
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ Failed to undeafen the user. Do I have enough permissions?',
        ephemeral: true
      });
    }
  },
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
