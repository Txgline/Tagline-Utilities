const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const notesPath = path.join(__dirname, '../../Data/notes.json');

function loadNotes() {
  if (!fs.existsSync(notesPath)) fs.writeFileSync(notesPath, JSON.stringify({}));
  return JSON.parse(fs.readFileSync(notesPath));
}

function saveNotes(data) {
  fs.writeFileSync(notesPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a private note about a member.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to note about')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('note')
        .setDescription('The note to add')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const noteText = interaction.options.getString('note');
    const guildId = interaction.guild.id;
    const userId = user.id;

    const notes = loadNotes();

    if (!notes[guildId]) notes[guildId] = {};
    if (!notes[guildId][userId]) notes[guildId][userId] = [];

    notes[guildId][userId].push({
      moderator: interaction.user.tag,
      note: noteText,
      timestamp: new Date().toISOString(),
    });

    saveNotes(notes);

    await interaction.reply({
      content: `📝 Note added for **${user.tag}**.`,
      ephemeral: true
    });
  },
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
