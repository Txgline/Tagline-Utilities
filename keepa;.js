const express = require('express');
const bodyParser = require('body-parser');
const { createCanvas, loadImage } = require('canvas');
const fetch = require('node-fetch');
const { Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const client = new Client({ intents: 3276799 });
client.login(process.env.TOKEN);

const app = express();
app.use(bodyParser.json());

async function loadRobloxAvatar(userId) {
    try {
        const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`;
        const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`Failed to fetch avatar JSON: ${res.status}`);
        const json = await res.json();
        const imageUrl = json.data?.[0]?.imageUrl;
        if (!imageUrl) throw new Error('No imageUrl found');

        const imgRes = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const buffer = await imgRes.arrayBuffer();
        return await loadImage(Buffer.from(buffer));
    } catch {
        return await loadImage('https://i.imgur.com/0PqOKSA.png'); // fallback avatar
    }
}

// Node function to determine color from Robux amount
function getColorFromAmount(amount) {
    if (amount >= 10000000) return '#FB0505';
    if (amount >= 1000000) return '#ff0064';
    if (amount >= 100000) return '#ff00e6';
    if (amount >= 10000) return '#00b3ff';
    if (amount >= 1) return '#08ff24';
    return '#00bdff'; // default
}

// Main donation card generator
async function generateDonationCard({ donator, receiver, amount, color }) {
    const width = 1200;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Use custom color if provided, otherwise calculate from amount
    const dynamicColor = color || getColorFromAmount(amount);

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Load avatars
    const donatorAvatar = await loadRobloxAvatar(donator.id);
    const receiverAvatar = await loadRobloxAvatar(receiver.id);

    const circleRadius = 100;
    const avatarY = height / 2;
    const donatorX = width * 0.15;
    const receiverX = width * 0.85;

    // Draw circular avatars
    [ [donatorAvatar, donatorX], [receiverAvatar, receiverX] ].forEach(([avatar, x]) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, avatarY, circleRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, x - circleRadius, avatarY - circleRadius, circleRadius * 2, circleRadius * 2);
        ctx.restore();

        // Circle border
        ctx.strokeStyle = dynamicColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(x, avatarY, circleRadius + 4, 0, Math.PI * 2);
        ctx.stroke();
    });

    // Robux amount text
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = dynamicColor;
    ctx.fillText(`R$ ${amount.toLocaleString()}`, width / 2, height * 0.4);

    // "donated to" text
    ctx.font = '50px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('donated to', width / 2, height * 0.55);

    // Donator & receiver names
    ctx.font = '35px sans-serif';
    ctx.fillText(`@${donator.username}`, donatorX, avatarY + circleRadius + 50);
    ctx.fillText(`@${receiver.username}`, receiverX, avatarY + circleRadius + 50);

    return canvas.toBuffer('image/png');
}

// Example usage with Discord.js
async function sendDonationEmbed(channel, donator, receiver, amount, color) {
    const buffer = await generateDonationCard({ donator, receiver, amount, color });
    const attachment = new AttachmentBuilder(buffer, { name: 'donation.png' });

    const embed = {
        title: 'New Donation!',
        description: `${donator.username} just donated R$ ${amount.toLocaleString()} to ${receiver.username}!`,
        image: { url: 'attachment://donation.png' },
        color: color ? parseInt(color.replace('#', ''), 16) : 0x00bdff
    };

    await channel.send({ embeds: [embed], files: [attachment] });
}

module.exports = { generateDonationCard, sendDonationEmbed };

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
        const { donator, receiver, amount, color } = req.body;

        // Validate payload
        if (!donator || !donator.id) return res.status(400).json({ error: "Missing donator.id" });
        if (!receiver || !receiver.id) return res.status(400).json({ error: "Missing receiver.id" });
        if (typeof amount !== "number") return res.status(400).json({ error: "Invalid amount" });

        // Generate the donation card
        const buffer = await generateDonationCard({ donator, receiver, amount, color });
        const attachment = new AttachmentBuilder(buffer, { name: 'donation.png' });

        const embed = {
            title: 'New Donation!',
            description: `${donator.username} just donated R$ ${amount.toLocaleString()} to ${receiver.username}!`,
            image: { url: 'attachment://donation.png' },
            color: color ? parseInt(color.replace('#', ''), 16) : 0x00bdff
        };

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
