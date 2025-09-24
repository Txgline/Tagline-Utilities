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
📢 **Announcement Pings** - Be the first to know about important news and updates.
🎲 **Random Pings** - Get notified for fun and unexpected announcements.
🥀 **Chat Reviver** - Get pinged when it's time to bring the chat back to life.
🤣 **Hall of Shame** - Stay updated on funny or embarrassing moments.
🛠️ **Update Pings** - Don't miss out on new features, fixes, or improvements.
🎉 **Giveaway Pings** - Be alerted whenever a giveaway starts!
Click the Reaction to Get the Role.
`)
      .setColor('#190e4e')
      .setFooter({ text: "Tagline's Utilities" })
      .setTimestamp();

    const message = await interaction.channel.send({ embeds: [embed] });

    // Add reactions to the message
    await message.react('📢');
    await message.react('🎲');
    await message.react('🥀');
    await message.react('🤣');
    await message.react('🛠️');
    await message.react('🎉');

    await interaction.reply({ content: '✅ Reaction role message sent!', flags: 64 });
  },
};
