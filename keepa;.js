const express = require('express');
const bodyParser = require('body-parser');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const client = new Client({ intents: 3276799 });
client.login(process.env.TOKEN);

const app = express();
app.use(bodyParser.json());
const fetch = require('node-fetch');

async function loadRobloxAvatar(userId) {
    try {
        const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`;
        const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const json = await res.json();
        const imageUrl = json.data?.[0]?.imageUrl;
        if (!imageUrl) throw new Error('No imageUrl found');
        const imgRes = await fetch(imageUrl);
        const buffer = await imgRes.arrayBuffer();
        return await loadImage(Buffer.from(buffer));
    } catch {
        return await loadImage('https://i.imgur.com/0PqOKSA.png');
    }
}

// Get border color
function getColorFromAmount(amount) {
    if (amount >= 10000000) return '#FB0505';
    if (amount >= 1000000) return '#ff0064';
    if (amount >= 100000) return '#ff00e6';
    if (amount >= 10000) return '#00b3ff';
    if (amount >= 1) return '#08ff24';
    return '#00bdff';
}

// Generate donation card with perfectly centered Robux emoji
async function generateDonationCard({ donator, receiver, amount, color, robuxEmojiUrl }) {
    const width = 1200;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const dynamicColor = color || getColorFromAmount(amount);

    // Transparent background
    ctx.clearRect(0, 0, width, height);

    // Load avatars
    const donatorAvatar = await loadRobloxAvatar(donator.id);
    const receiverAvatar = await loadRobloxAvatar(receiver.id);

    const circleRadius = 100;
    const avatarY = height / 2;
    const donatorX = width * 0.15;
    const receiverX = width * 0.85;

    // Draw avatars + colored borders
    [[donatorAvatar, donatorX], [receiverAvatar, receiverX]].forEach(([avatar, x]) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, avatarY, circleRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, x - circleRadius, avatarY - circleRadius, circleRadius * 2, circleRadius * 2);
        ctx.restore();

        ctx.strokeStyle = dynamicColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(x, avatarY, circleRadius + 4, 0, Math.PI * 2);
        ctx.stroke();
    });

    // Draw Robux emoji perfectly centered
    if (robuxEmojiUrl) {
        try {
            const emojiImage = await loadImage(robuxEmojiUrl);
            const emojiSize = 80; // size of emoji
            ctx.drawImage(emojiImage, width / 2 - emojiSize / 2, avatarY - emojiSize / 2, emojiSize, emojiSize);
        } catch (err) {
            console.warn("Failed to load Robux emoji:", err.message);
        }
    }

    return canvas.toBuffer('image/png');
}

module.exports = { generateDonationCard };

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
        const { donator, receiver, amount, color, emoji } = req.body;

        if (!donator?.id || !receiver?.id || typeof amount !== 'number')
            return res.status(400).json({ error: 'Invalid payload' });

        const robuxEmojiUrl = "https://cdn.discordapp.com/emojis/1206541048063459348.webp?size=96";

        // Generate card image (without any text, only avatars + borders + Robux emoji)
        const buffer = await generateDonationCard({ donator, receiver, amount, color, robuxEmojiUrl });
        const attachment = new AttachmentBuilder(buffer, { name: 'donation.png' });

        const channel = await client.channels.fetch('1273828770884620438');

        // Message content with emojis, usernames in backticks, bold Robux amount
        const robuxEmojiMessage = "<:robux:1206541048063459348>";
        const content = `${emoji || ""} \`${donator.username}\` just donated ${robuxEmojiMessage} **R$ ${amount.toLocaleString()}** to \`${receiver.username}\`!`;

        // Send embed with only the image
        const embed = new EmbedBuilder()
            .setImage('attachment://donation.png')
            .setColor(color ? parseInt(color.replace('#', ''), 16) : 0x00bdff);

        await channel.send({ content, embeds: [embed], files: [attachment] });

        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
