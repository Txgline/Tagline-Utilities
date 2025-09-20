const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlocks a locked channel so everyone can send messages.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to unlock')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({ content: '❌ You do not have permission to unlock channels.', ephemeral: true });
    }

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: true,
      });

      const embed = new EmbedBuilder()
        .setTitle('🔓 Channel Unlocked')
        .setDescription(`Everyone can now send messages in ${channel}.`)
        .setColor('Green')
        .setFooter({ text: `Unlocked by ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Failed to unlock the channel. Check bot permissions.', ephemeral: true });
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
