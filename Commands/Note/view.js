const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const notesPath = path.join(__dirname, '../../Data/notes.json');

function loadNotes() {
  if (!fs.existsSync(notesPath)) fs.writeFileSync(notesPath, JSON.stringify({}));
  return JSON.parse(fs.readFileSync(notesPath));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('view')
    .setDescription('View all notes for a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to view notes for')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;
    const userId = user.id;

    const notes = loadNotes();

    if (!notes[guildId] || !notes[guildId][userId] || notes[guildId][userId].length === 0) {
      return interaction.reply({
        content: `❌ No notes found for **${user.tag}**.`,
        ephemeral: true
      });
    }

    const userNotes = notes[guildId][userId];

    const embed = new EmbedBuilder()
      .setTitle(`📝 Notes for ${user.tag}`)
      .setColor('Blue')
      .setFooter({ text: `Total Notes: ${userNotes.length}` })
      .setTimestamp();

    userNotes.forEach((note, index) => {
      embed.addFields({
        name: `#${index + 1} • ${note.moderator}`,
        value: `> ${note.note}\n🕒 <t:${Math.floor(new Date(note.timestamp).getTime() / 1000)}:R>`,
      });
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
