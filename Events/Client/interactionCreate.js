module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const mainCommand = interaction.commandName;

    let subCommand = null;
    try {
      subCommand = interaction.options.getSubcommand();
    } catch (err) {
      // It's okay — not all commands have subcommands
    }

    const commandKey = subCommand
      ? `${mainCommand}-${subCommand}`
      : mainCommand;

    const command = client.commands.get(commandKey);

    if (!command) {
      return interaction.reply({
        content: "❌ Command not found.",
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`[Interaction Error] ${error}`);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "❌ There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "❌ There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};
