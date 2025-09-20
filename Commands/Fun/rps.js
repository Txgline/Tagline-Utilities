const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock Paper Scissors with the bot!')
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Your choice')
        .setRequired(true)
        .addChoices(
          { name: 'Rock 🪨', value: 'rock' },
          { name: 'Paper 📄', value: 'paper' },
          { name: 'Scissors ✂️', value: 'scissors' }
        )
    ),

  async execute(interaction) {
    const userChoice = interaction.options.getString('choice');
    const choices = ['rock', 'paper', 'scissors'];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result;
    if (userChoice === botChoice) {
      result = "It's a draw!";
    } else if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) {
      result = "You win! 🎉";
    } else {
      result = "You lose! 😢";
    }

    const choiceEmojis = {
      rock: '🪨',
      paper: '📄',
      scissors: '✂️'
    };

    const embed = new EmbedBuilder()
      .setTitle('🕹️ Rock Paper Scissors')
      .addFields(
        { name: 'Your Choice', value: `${choiceEmojis[userChoice]} ${userChoice}`, inline: true },
        { name: 'Bot\'s Choice', value: `${choiceEmojis[botChoice]} ${botChoice}`, inline: true },
        { name: 'Result', value: result }
      )
      .setColor(result.includes('win') ? 'Green' : result.includes('lose') ? 'Red' : 'Yellow')
      .setFooter({ text: `Played by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};


/**
 * @INFO
 * Made BY PHV#3071
 * Discord Support Server: https://discord.gg/mtGUKAuRMT
 * YouTube: https://www.youtube.com/@phvdev04/videos
 * Don't steal credits or else instant copyright.
 */
