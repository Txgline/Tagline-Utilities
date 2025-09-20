const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setnick')
    .setDescription('Changes the nickname of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to change the nickname of')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nickname')
        .setDescription('The new nickname')
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const nickname = interaction.options.getString('nickname');
    const member = interaction.guild.members.cache.get(target.id);

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      return interaction.reply({ content: '❌ You don\'t have permission to manage nicknames.', ephemeral: true });
    }

    if (!member) {
      return interaction.reply({ content: '❌ Member not found in this server.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      return interaction.reply({ content: '❌ I don\'t have permission to manage nicknames.', ephemeral: true });
    }

    if (interaction.member.roles.highest.position <= member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ content: '❌ You can only change nicknames of members below your role.', ephemeral: true });
    }

    try {
      await member.setNickname(nickname);
      const embed = new EmbedBuilder()
        .setTitle('✅ Nickname Changed')
        .setDescription(`**${target.tag}**'s nickname has been changed to **${nickname}**`)
        .setColor('Green');
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Something went wrong while changing the nickname.', ephemeral: true });
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
