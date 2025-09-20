const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inviteinfo')
    .setDescription('Get information about a Discord invite.')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('The invite code or full invite link')
        .setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString('code');
    const code = input.match(/(discord\.gg\/|discord\.com\/invite\/)?([a-zA-Z0-9-]+)/)?.[2];

    if (!code) {
      return interaction.reply({ content: '❌ Invalid invite code or link.', ephemeral: true });
    }

    try {
      const invite = await interaction.client.fetchInvite(code, { withCounts: true });

      const embed = new EmbedBuilder()
        .setTitle('🔗 Invite Information')
        .addFields(
          { name: '📨 Code', value: invite.code, inline: true },
          { name: '📛 Server', value: invite.guild?.name || 'Unknown', inline: true },
          { name: '🆔 Server ID', value: invite.guild?.id || 'Unknown', inline: true },
          { name: '💬 Channel', value: `${invite.channel?.name} (${invite.channel?.id})`, inline: true },
          { name: '👤 Inviter', value: invite.inviter ? `${invite.inviter.tag}` : 'Unknown', inline: true },
          { name: '👥 Approx Members', value: `${invite.approximate_member_count ?? 'Unavailable'}`, inline: true },
          { name: '✅ Online Now', value: `${invite.approximate_presence_count ?? 'Unavailable'}`, inline: true },
          { name: '🔂 Temporary Join', value: invite.temporary ? 'Yes' : 'No', inline: true },
          { name: '🔁 Max Uses', value: invite.maxUses ? `${invite.maxUses}` : 'Unlimited', inline: true },
          { name: '🔢 Uses So Far', value: invite.uses != null ? `${invite.uses}` : 'Unknown', inline: true },
          {
            name: '🕒 Expires At',
            value: invite.expiresAt ? time(invite.expiresAt, 'F') : 'Never',
            inline: true,
          },
        )
        .setColor('Blurple')
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Error fetching invite info:', error);
      return interaction.reply({ content: '❌ Could not fetch the invite. It may be invalid, expired, or inaccessible.', ephemeral: true });
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
