const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock the current channel with optional timer and message.')
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('Time in minutes to unlock automatically (optional)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for locking the channel (optional)')
        .setRequired(false))
    .setDMPermission(false),

  async execute(interaction) {
    const channel = interaction.channel;
    const time = interaction.options.getInteger('time');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Check user permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: '❌ You do not have permission to lock channels.', ephemeral: true });
    }

    // Check bot permission
    if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: '❌ I do not have permission to manage this channel.', ephemeral: true });
    }

    // Lock the channel
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false
    });

    const embed = new EmbedBuilder()
      .setTitle('🔒 Channel Locked')
      .setDescription(`Channel has been locked.\n**Reason:** ${reason}`)
      .setColor('Orange')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Auto-unlock if timer is provided
    if (time) {
      setTimeout(async () => {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: null
        });

        const unlockEmbed = new EmbedBuilder()
          .setTitle('🔓 Channel Unlocked')
          .setDescription(`Channel has been automatically unlocked after ${time} minute(s).`)
          .setColor('Green')
          .setTimestamp();

        await channel.send({ embeds: [unlockEmbed] });
      }, time * 60000);
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
