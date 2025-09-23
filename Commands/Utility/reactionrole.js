const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionroles')
    .setDescription('Send a reaction role embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Reaction Roles')
      .setDescription(`
React with the emoji to get the role:

👍 = Member  
🔥 = VIP  
🎮 = Gamer
`)
      .setColor('#2e184b');

    const message = await interaction.channel.send({ embeds: [embed] });

    // Add reactions to the message
    await message.react('👍');
    await message.react('🔥');
    await message.react('🎮');

    await interaction.reply({ content: '✅ Reaction role message sent!', flags: 64 });
  },
};
