const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows information about this server'),

  async execute(interaction) {
    const { guild } = interaction;

    await guild.fetch();
    const owner = await guild.fetchOwner();

    const roles = guild.roles.cache
      .filter(r => r.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map(r => r.toString());

    const displayedRoles = roles.slice(0, 10).join(', ') + (roles.length > 10 ? ` +${roles.length - 10} more` : '');

    const channels = guild.channels.cache;
    const textChannels = channels.filter(c => c.type === 0).size;
    const voiceChannels = channels.filter(c => c.type === 2).size;
    const categories = channels.filter(c => c.type === 4).size;

    const verificationLevels = ['None', 'Low', 'Medium', 'High', 'Very High'];

    const embed = new EmbedBuilder()
      .setTitle(`📊 Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .setColor('Blurple')
      .addFields(
        { name: '🆔 Server ID', value: guild.id, inline: true },
        { name: '👑 Owner', value: `<@${owner.id}>`, inline: true },
        { name: '🌍 Region', value: guild.preferredLocale || 'Unknown', inline: true },
        { name: '📆 Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
        { name: '💬 Channels', value: `Text: ${textChannels} | Voice: ${voiceChannels} | Categories: ${categories}`, inline: true },
        { name: '🔐 Verification Level', value: verificationLevels[guild.verificationLevel] || 'Unknown', inline: true },
        { name: '🎭 Roles', value: displayedRoles || 'None', inline: false },
        { name: '🆙 Boosts', value: `Level ${guild.premiumTier} with ${guild.premiumSubscriptionCount} boosts`, inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
