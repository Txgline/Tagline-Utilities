const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription("Change the bot's nickname in this server.")
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The new nickname for the bot (leave blank to reset)')
        .setMaxLength(32)
        .setRequired(false)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const newNickname = interaction.options.getString('name');
    const botMember = interaction.guild.members.me;

    // Check permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      return interaction.reply({
        content: '❌ You need the **Manage Nicknames** permission to change my nickname.',
        ephemeral: true,
      });
    }

    try {
      await botMember.setNickname(newNickname || null);
      await interaction.reply({
        content: newNickname
          ? `✅ My nickname has been changed to **${newNickname}**!`
          : '✅ My nickname has been reset to default.',
      });
    } catch (error) {
      console.error('Nickname Error:', error);
      await interaction.reply({
        content: '❌ I was unable to change my nickname. Make sure I have the required permissions and my role is high enough.',
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
