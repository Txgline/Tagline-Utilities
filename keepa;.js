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
        // Fetch avatar headshot JSON
        const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`;
        const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`Failed to fetch avatar JSON: ${res.status}`);
        
        const json = await res.json();
        const imageUrl = json.data?.[0]?.imageUrl;
        if (!imageUrl) throw new Error('No imageUrl found in response');

        // Fetch the actual image as buffer
        const imageRes = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const buffer = await imageRes.arrayBuffer();

        return await loadImage(Buffer.from(buffer));
    } catch {
        // Fallback image if Roblox API fails
        return await loadImage('https://i.imgur.com/0PqOKSA.png');
    }
}

async function generateDonationCard({
    donatorProfileId,
    raiserProfileId,
    donatorName,
    raiserName,
    robuxAmount,
    primaryColor
}) {
    const width = 1200;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Sanitize color
    const cleanColor = (primaryColor || 'FF00FF').replace('#', '');
    const dynamicColor = `#${cleanColor}`;

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Load avatars
    const donatorAvatar = await loadRobloxAvatar(donatorProfileId);
    const raiserAvatar = await loadRobloxAvatar(raiserProfileId);

    const circleRadius = 100;
    const avatarY = height / 2;
    const donatorAvatarX = width * 0.15;
    const raiserAvatarX = width * 0.85;

    // Draw Donator Avatar in circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(donatorAvatarX, avatarY, circleRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(donatorAvatar, donatorAvatarX - circleRadius, avatarY - circleRadius, circleRadius * 2, circleRadius * 2);
    ctx.restore();

    // Draw Raiser Avatar in circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(raiserAvatarX, avatarY, circleRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(raiserAvatar, raiserAvatarX - circleRadius, avatarY - circleRadius, circleRadius * 2, circleRadius * 2);
    ctx.restore();

    // Draw circles around avatars
    ctx.strokeStyle = dynamicColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(donatorAvatarX, avatarY, circleRadius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(raiserAvatarX, avatarY, circleRadius + 4, 0, Math.PI * 2);
    ctx.stroke();

    // Robux amount text
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = dynamicColor;
    ctx.fillText(`R$ ${robuxAmount.toLocaleString()}`, width / 2, height * 0.4);

    // "donated to" text
    ctx.font = '50px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('donated to', width / 2, height * 0.55);

    // Donator & Raiser names
    ctx.font = '35px sans-serif';
    ctx.fillText(`@${donatorName}`, donatorAvatarX, avatarY + circleRadius + 50);
    ctx.fillText(`@${raiserName}`, raiserAvatarX, avatarY + circleRadius + 50);

    return canvas.toBuffer('image/png');
}

module.exports = generateDonationCard;

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
