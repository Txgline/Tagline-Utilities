const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const welcomeChannelId = "1417860530596479086";
    const autoRoleId = "1417860529724198996";

    if (!welcomeChannelId) return console.log("No welcome channel configured.");

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return console.error(`Channel with ID ${welcomeChannelId} does not exist.`);

    try {
      // Assign role
      const role = member.guild.roles.cache.get(autoRoleId);
      if (role) await member.roles.add(role);

      // Channel embed
      const channelEmbed = new EmbedBuilder()
        .setColor(0x7100d5)
        .setTitle("<:sunglass:1180181149797072896> Tagline Club [TC]!")
        .setDescription(
         `→ <:kool:1300228217243832423> Welcome, ${member} to Tagline Club [TC] \nWe're excited to have you here and hope you enjoy your time with us.\n\n` +
                `→ <:begger:1280208774908612774> Please review the rules in <#1417860530596479089> to help us keep the community safe, respectful, and enjoyable for everyone.\n\n` +
                `→ <:pijamafrog:1126508357914742864> Explore the Roles:\nVisit <#1417860530596479092> to learn what each role does and find one that fits you!\n\n` +
                `→ <:coolsmile:1280053756163129364> Introduce yourself in <#1417860531397591195> — we'd love to get to know you!`,
        )
        .setImage("https://i.imgur.com/xUirQtU.jpeg")
        .setFooter({ text: "Tagline Club – Where fun meets community 💬", iconURL: "https://i.imgur.com/0PqOKSA.png" })
        .setTimestamp();

      const welcomeMessage = await channel.send({ embeds: [channelEmbed] });

      // React to the channel embed
      await welcomeMessage.react('👋');

      // DM embed
      const dmEmbed = new EmbedBuilder()
        .setColor(0x7100d5)
        .setTitle("<:sunglass:1180181149797072896> Welcome to Tagline Club [TC]!")
        .setDescription(
          `Hi ${member}!\n\n` +
          `→ <:kool:1300228217243832423> We’re happy to have you here! Here’s a quick guide to get started:\n\n` +
                  `→ <:begger:1280208774908612774> **Read the Rules:**\nCheck out <#1417860530596479089> to keep the community safe and enjoyable for everyone.\n\n` +
                  `→ <:pijamafrog:1126508357914742864> **Explore the Roles:**\nVisit <#1113354226115018776> to learn what each role does and find one that fits you!\n\n` +
                  `→ <:coolsmile:1280053756163129364> **Say Hello:**\nDrop a friendly message in <#1417860531397591195> and meet new people!`,
        )
        .setImage("https://i.imgur.com/xUirQtU.jpeg")
        .setFooter({ text: "Welcome - Tagline's Utilities", iconURL: "https://i.imgur.com/0PqOKSA.png" })
        .setTimestamp();

      await member.send({ embeds: [dmEmbed] }).catch(() => {
        console.log(`Could not send DM to ${member.user.tag}.`);
      });

    } catch (error) {
      console.error("Error sending welcome message:", error);
    }
  },
};
