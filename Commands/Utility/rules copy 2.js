const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('social')
    .setDescription('Displays the server social')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    try {
      const embed2 = new EmbedBuilder()
        .setImage('https://media.discordapp.net/attachments/1362182753537491054/1391907523342237706/Socials.gif?ex=68dbafa5&is=68da5e25&hm=4671e4e7864f88ff6deab2cb132968430a82682d18e740cee3dd3ca804d8bb80')
        .setColor('#190e4e');

        const embed10 = new EmbedBuilder()
      .setDescription(`<:robuxbag:1421752726357938266> [Earn and Donate](https://www.roblox.com/games/100747960449802/Earn-and-Donate)\n
<:robuxs:1421753470272147586> [PLS DONATE Z](https://www.roblox.com/games/76819241593867/PLS-DONATE-Z)\n
 <:taglineclub:1421754443128639509> [Tagline Club Roblox Group](https://www.roblox.com/communities/17015122/Tagline-Club#!/about)\n
<:FakeNitroEmoji:1421753852331298836> [Twitter](https://x.com/txgline)\n
<:youtube:1421777263887777822> [YouTube](https://www.youtube.com/@txglines)
        `)
        .setColor('#190e4e')
        .setFooter({ text: "Tagline's Utilities" })
        .setTimestamp();

      await interaction.channel.send({ embeds: [embed2, embed10] });
await interaction.reply({
  content: '✅ Social sent!',
  flags: 64 // makes it ephemeral
});
    } catch (err) {
      console.error(err);
      await interaction.reply({
  content: '❌ Failed to send the Social.',
  flags: 64 // makes it ephemeral
});
    }
  },
};
