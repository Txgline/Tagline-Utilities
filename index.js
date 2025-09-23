require('dotenv').config();

const { Client, Collection } = require('discord.js');
const client = new Client({
  intents: 3276799 
});

const fs = require('fs');
const path = require('path');
const keepalive = require('./keepa;')
const { Events } = require('discord.js');

client.commands = new Collection();

['commandHandler', 'eventHandler'].forEach(handler =>
  require(`./Handlers/${handler}`)(client)
);

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  const { message, emoji } = reaction;
  const guild = message.guild;
  const member = await guild.members.fetch(user.id);

  // Example: match emoji → role ID
  if (emoji.name === '👍') {
    await member.roles.add('1417860529761943601');
  }
  if (emoji.name === '🔥') {
    await member.roles.add('1417860529761943600');
  }
  if (emoji.name === '🎮') {
    await member.roles.add('1417860529761943598');
  }
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot) return;

  const { message, emoji } = reaction;
  const guild = message.guild;
  const member = await guild.members.fetch(user.id);

  if (emoji.name === '👍') {
    await member.roles.remove('ROLE_ID_MEMBER');
  }
  if (emoji.name === '🔥') {
    await member.roles.remove('ROLE_ID_VIP');
  }
  if (emoji.name === '🎮') {
    await member.roles.remove('ROLE_ID_GAMER');
  }
});

client.roleAssignmentIntervals = new Map();

client.login(process.env.TOKEN);
