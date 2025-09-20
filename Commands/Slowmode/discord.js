const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('discord')
    .setDescription('Set Discord built-in slowmode for a text channel.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the text channel')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('Slowmode in seconds (0 to disable, max 21600)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const seconds = interaction.options.getInteger('seconds');

    try {
      await channel.setRateLimitPerUser(seconds, `Set by ${interaction.user.tag}`);
      return interaction.reply({
        content: seconds === 0
          ? `✅ Slowmode has been **disabled** in ${channel}.`
          : `✅ Slowmode set to **${seconds} second(s)** in ${channel}.`,
      });
    } catch (error) {
      console.error('Error setting slowmode:', error);
      return interaction.reply({
        content: '❌ Failed to set slowmode. Please ensure I have permission to manage the channel.',
        ephemeral: true,
      });
    }
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
