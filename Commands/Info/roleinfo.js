const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Shows information about a specific role.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role you want to view info about')
        .setRequired(true))
    .setDMPermission(false),

  async execute(interaction) {
    const role = interaction.options.getRole('role');

    const embed = new EmbedBuilder()
      .setTitle(`🔍 Role Info: ${role.name}`)
      .setColor(role.color || 0x2f3136)
      .addFields(
        { name: '🆔 Role ID', value: role.id, inline: true },
        { name: '📛 Name', value: role.name, inline: true },
        { name: '🎨 Color', value: role.hexColor.toUpperCase(), inline: true },
        { name: '📌 Position', value: role.position.toString(), inline: true },
        { name: '👤 Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: '📢 Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
        { name: '🔒 Managed by Bot', value: role.managed ? 'Yes' : 'No', inline: true },
        { name: '🧑‍🤝‍🧑 Members with Role', value: `${role.members.size}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

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
