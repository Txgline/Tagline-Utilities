const express = require('express');
const bodyParser = require('body-parser');
const { createCanvas, loadImage } = require('canvas');
const fetch = require('node-fetch');
const { Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const client = new Client({ intents: 3276799 });
client.login(process.env.TOKEN);

const app = express();
app.use(bodyParser.json());

async function generateDonationCard(donator, receiver, amount) {
    const width = 800, height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background color based on donation
    let bgColor = '#00bdff';
    if (amount >= 10000000) bgColor = '#FB0505';
    else if (amount >= 1000000) bgColor = '#ff0064';
    else if (amount >= 100000) bgColor = '#ff00e6';
    else if (amount >= 10000) bgColor = '#00b3ff';
    else if (amount >= 1) bgColor = '#08ff24';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Download avatars
    const donatorAvatar = await loadImage(`https://www.roblox.com/headshot-thumbnail/image?userId=${donator.id}&width=150&height=150&format=png`);
    const receiverAvatar = await loadImage(`https://www.roblox.com/headshot-thumbnail/image?userId=${receiver.id}&width=150&height=150&format=png`);
    ctx.drawImage(donatorAvatar, 50, 75, 150, 150);
    ctx.drawImage(receiverAvatar, 600, 75, 150, 150);

    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`${donator.username} (${donator.displayName})`, 50, 50);
    ctx.fillText(`${receiver.username} (${receiver.displayName})`, 600, 50);

    ctx.font = 'bold 32px Arial';
    ctx.fillText(`donated ${amount.toLocaleString()} Robux`, 250, 160);

    return canvas.toBuffer();
}

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

app.post('/donation', async (req, res) => {
    try {
        const { donator, receiver, amount } = req.body;

        const buffer = await generateDonationCard(donator, receiver, amount);
        const attachment = new AttachmentBuilder(buffer, { name: 'donation.png' });

        const embed = new EmbedBuilder()
            .setTitle('New Donation!')
            .setDescription(`${donator.username} just donated ${amount.toLocaleString()} Robux to ${receiver.username}!`)
            .setImage('attachment://donation.png');

        const channel = await client.channels.fetch('1273828770884620438');
        await channel.send({ embeds: [embed], files: [attachment] });

        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
