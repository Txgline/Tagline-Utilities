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

  if (emoji.name === '📢') {
    await member.roles.add('1417860529724198994');
  }
  if (emoji.name === '🎲') {
    await member.roles.add('1417860529724198995');
  }
  if (emoji.name === '🥀') {
    await member.roles.add('1417860529724198993');
  }
  if (emoji.name === '🤣') {
    await member.roles.add('1420095235337228310');
  }
  if (emoji.name === '🛠️') {
    await member.roles.add('1420095492179628193');
  }
  if (emoji.name === '🎉') {
    await member.roles.add('1417860529724198992');
  }

});
/*
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
*/

client.roleAssignmentIntervals = new Map();

client.login(process.env.TOKEN);
