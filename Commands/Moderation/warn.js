const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../../config.json"); // Make sure this points to your config.json

const warnsPath = path.join(__dirname, "../../Data/warns.json");

function loadWarns() {
  if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, "{}");
  return JSON.parse(fs.readFileSync(warnsPath, "utf8"));
}

function saveWarns(data) {
  fs.writeFileSync(warnsPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user for a specific reason.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to warn")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for warning")
        .setRequired(true),
    ),

  async execute(interaction) {
    const member = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return interaction.reply({
        content: "❌ You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({
        content: "❌ You cannot warn yourself.",
        ephemeral: true,
      });
    }

    const warns = loadWarns();
    const guildId = interaction.guild.id;
    const userId = member.id;

    if (!warns[guildId]) warns[guildId] = {};
    if (!warns[guildId][userId]) warns[guildId][userId] = [];

    warns[guildId][userId].push({
      reason: reason,
      date: new Date().toISOString(),
      moderator: interaction.user.id,
    });

    saveWarns(warns);

    // Reply to executor
    await interaction.reply({
      content: `✅ **${member.tag}** has been warned.`,
    });

    // --- DM the warned user ---
    try {
      await member.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`⚠️ You have been warned in ${interaction.guild.name}`)
            .setDescription(`Reason: ${reason}`)
            .setColor("Orange")
            .setTimestamp(),
        ],
      });
    } catch (err) {
      console.log(`Could not DM ${member.tag}. They may have DMs closed.`);
    }

    // Send log to unified mod logs channel
    const logsChannel = interaction.guild.channels.cache.get(
      config.modLogsChannelId,
    );
    if (logsChannel) {
      const logEmbed = new EmbedBuilder()
        .setTitle("⚠️ User Warned")
        .setColor("Orange")
        .addFields(
          { name: "User", value: `${member.tag} (${member.id})` },
          {
            name: "Moderator",
            value: `${interaction.user.tag} (${interaction.user.id})`,
          },
          { name: "Reason", value: reason },
          { name: "Date", value: new Date().toLocaleString() },
        );
      logsChannel.send({ embeds: [logEmbed] });
    }
  },
};
