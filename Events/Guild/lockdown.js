const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const lockdownPath = path.join(__dirname, '../../Data/lockdown.json');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'lockdown_channels') return;

    try {
      // Defer the interaction to avoid "interaction failed"
      await interaction.deferUpdate();

      // Load or initialize the JSON database
      const db = fs.existsSync(lockdownPath)
        ? JSON.parse(fs.readFileSync(lockdownPath, 'utf8'))
        : {};

      // Save selected channel IDs under this guild's ID
      db[interaction.guild.id] = interaction.values;

      // Write updated data to the file
      fs.writeFileSync(lockdownPath, JSON.stringify(db, null, 2));

      // Confirm to the user with the selected channels
      await interaction.editReply({
        content: `✅ Lockdown channels saved:\n${interaction.values.map(id => `<#${id}>`).join('\n')}`,
        components: []
      });
    } catch (error) {
      console.error('Failed to save lockdown channels:', error);
      try {
        await interaction.editReply({
          content: '❌ Failed to save lockdown channels.',
          components: []
        });
      } catch {
        await interaction.followUp({
          content: '❌ Could not respond properly. Please try again.',
          ephemeral: true
        });
      }
    }
  }
};
