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
    .setName('clear')
    .setDescription('Clear all notes of a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose notes you want to clear')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;
    const userId = user.id;

    const notes = loadNotes();

    if (!notes[guildId] || !notes[guildId][userId]) {
      return interaction.reply({
        content: `❌ No notes found for **${user.tag}**.`,
        ephemeral: true,
      });
    }

    delete notes[guildId][userId];
    saveNotes(notes);

    await interaction.reply({
      content: `✅ Cleared all notes for **${user.tag}**.`,
      ephemeral: true,
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
