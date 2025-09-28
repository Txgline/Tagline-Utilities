const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('social')
    .setDescription('Displays the server social')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    try {
      const embed2 = new EmbedBuilder()
        .setImage('media.discordapp.net/attachments/1362182753537491054/1391907523342237706/Socials.gif?ex=68d9b565&is=68d863e5&hm=7da74d120c61db6a7928ff6e4c4d415c46e880508e44cd75fd2f32596ee45e83')
        .setColor('#190e4e');

        const embed10 = new EmbedBuilder()
      .setDescription(`<:robux~3:1349113935047032863> [Earn and Donate](https://www.roblox.com/games/100747960449802/Earn-and-Donate)\n
<:robuxbag:1286689979342393344> [PLS DONATE Z](https://www.roblox.com/games/129672063958972/PLS-DONATE-Z)\n
 <:QuataunGames:1286692487548899338> [Tagline Club Roblox Group!](https://www.roblox.com/communities/17015122/Tagline-Club#!/about)\n
<:tw:1405237318520016896> [Twitter](https://x.com/txgline)\n
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
      await interaction.reply({ content: '❌ Failed to send the Social.', ephemeral: true });
    }
  },
};
