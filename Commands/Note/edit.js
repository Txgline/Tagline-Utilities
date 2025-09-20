const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../Data/notes.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edit')
    .setDescription('Edit a specific note of a user')
    .addUserOption(option =>
      option.setName('user').setDescription('The user').setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('note_id')
        .setDescription('Note index')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option =>
      option.setName('new_note').setDescription('New note content').setRequired(true)
    ),

  async autocomplete(interaction) {
    const user = interaction.options.getUser('user');
    if (!user) return interaction.respond([]);

    if (!fs.existsSync(dbPath)) return interaction.respond([]);

    const notesData = JSON.parse(fs.readFileSync(dbPath));
    const guildId = interaction.guildId;
    const userNotes = notesData[guildId]?.[user.id] || [];

    const focused = interaction.options.getFocused();
    const suggestions = userNotes
      .map((note, index) => ({
        name: `${index + 1}. ${note.slice(0, 80)}${note.length > 80 ? '...' : ''}`,
        value: index + 1
      }))
      .filter(s => s.name.toLowerCase().includes(focused.toLowerCase()))
      .slice(0, 25);

    await interaction.respond(suggestions);
  },

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: '❌ You do not have permission to use this command.',
        ephemeral: true
      });
    }

    const member = interaction.options.getUser('user');
    const noteId = interaction.options.getInteger('note_id');
    const newNote = interaction.options.getString('new_note');
    const guildId = interaction.guildId;

    if (!fs.existsSync(dbPath)) {
      return interaction.reply({ content: '❌ No notes found.', ephemeral: true });
    }

    const notesData = JSON.parse(fs.readFileSync(dbPath));
    if (!notesData[guildId]?.[member.id] || !notesData[guildId][member.id][noteId - 1]) {
      return interaction.reply({ content: '❌ Note not found.', ephemeral: true });
    }

    notesData[guildId][member.id][noteId - 1] = newNote;
    fs.writeFileSync(dbPath, JSON.stringify(notesData, null, 2));

    interaction.reply({
      content: `✅ Updated note #${noteId} for <@${member.id}>.`,
      ephemeral: true
    });
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
