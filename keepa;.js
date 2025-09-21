require('dotenv').config();

const { Client, Collection, EmbedBuilder } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');

const client = new Client({
  intents: 3276799
});

const fs = require('fs');
const path = require('path');

client.commands = new Collection();
['commandHandler', 'eventHandler'].forEach(handler =>
  require(`./Handlers/${handler}`)(client)
);

client.roleAssignmentIntervals = new Map();

// 🚀 Setup Express API so Roblox can send logs AND keepalive
const app = express();
app.use(bodyParser.json());

// Keepalive route
app.get('/', (req, res) => {
  res.send("I'm alive");
});

// Roblox log route
app.post("/log", async (req, res) => {
  try {
    const { channelId, embeds } = req.body;
    const channel = await client.channels.fetch(channelId);

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    // Ensure embeds is always an array
    const embedArray = Array.isArray(embeds) ? embeds : [embeds];

    const builtEmbeds = embedArray.map(e => {
      const embed = new EmbedBuilder()
        .setTitle(e.title || "Log")
        .setDescription(e.description || "")
        .setColor(e.color ? parseInt(e.color) : 0x00bdff)
        .setTimestamp();

      if (Array.isArray(e.fields) && e.fields.length > 0) {
        embed.addFields(e.fields);
      }

      if (e.footer) embed.setFooter(e.footer);
      if (e.thumbnail) embed.setThumbnail(e.thumbnail);
      if (e.image) embed.setImage(e.image);

      return embed;
    });

    await channel.send({ embeds: builtEmbeds });

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Log failed:", err);
    res.status(500).json({ error: "failed" });
  }
});

// Use the same port for keepalive + logs
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`[API] Listening on port ${PORT}`));

// Use token from .env
client.login(process.env.TOKEN);
