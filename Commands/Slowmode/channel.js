const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Enable or disable slowmode for a channel.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the channel')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('Slowmode time in seconds (0 to disable)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    ),

  async execute(interaction) {
    // Permissions check
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({ content: '❌ You need the **Manage Channels** permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const time = interaction.options.getInteger('time');

    try {
      await channel.setRateLimitPerUser(time, `Slowmode changed by ${interaction.user.tag}`);

      if (time === 0) {
        return interaction.reply(`✅ Slowmode has been **disabled** in ${channel}.`);
      } else {
        return interaction.reply(`✅ Slowmode in ${channel} is now set to **${time} second(s)**.`);
      }
    } catch (error) {
      console.error('Failed to update slowmode:', error);
      return interaction.reply({ content: '❌ Failed to set slowmode. Make sure I have permission to manage the channel.', ephemeral: true });
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
