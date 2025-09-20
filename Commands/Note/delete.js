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
    .setName('delete')
    .setDescription('Delete a specific note from a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User whose note you want to delete')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('The index of the note to delete (starts from 1)')
        .setMinValue(1)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const index = interaction.options.getInteger('index');
    const guildId = interaction.guild.id;
    const userId = user.id;

    const notes = loadNotes();

    if (!notes[guildId] || !notes[guildId][userId] || notes[guildId][userId].length < index) {
      return interaction.reply({
        content: `❌ No note found at index ${index} for **${user.tag}**.`,
        ephemeral: true,
      });
    }

    const removed = notes[guildId][userId].splice(index - 1, 1)[0];
    if (notes[guildId][userId].length === 0) delete notes[guildId][userId];
    if (Object.keys(notes[guildId]).length === 0) delete notes[guildId];

    saveNotes(notes);

    await interaction.reply({
      content: `✅ Deleted note #${index} for **${user.tag}**:\n> ${removed}`,
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
