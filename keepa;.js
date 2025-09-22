const express = require('express');
const bodyParser = require('body-parser');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const client = new Client({ intents: 3276799 });
client.login(process.env.TOKEN);

const app = express();
app.use(bodyParser.json());
const fetch = require('node-fetch');
app.get('/', (req, res) => { res.send("I'm alive"); });

registerFont('./fonts/NotoSans-Regular.ttf', { family: 'NotoSans' });

async function loadRobloxAvatar(userId) {
    try {
        const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`;
        const res = await fetch(apiUrl);
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

async function generateDonationCard({ donator, receiver, amount, color, robuxEmojiUrl }) {
    const width = 1600;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const dynamicColor = color || getColorFromAmount(amount);

    // Load avatars
    const donatorAvatar = await loadRobloxAvatar(donator.id);
    const receiverAvatar = await loadRobloxAvatar(receiver.id);

    // Positions
    const circleRadius = 120;
    const avatarY = height / 2;
    const donatorX = width * 0.2;
    const receiverX = width * 0.8;

    // Draw avatars in circles
    [[donatorAvatar, donatorX], [receiverAvatar, receiverX]].forEach(([avatar, x]) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, avatarY, circleRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, x - circleRadius, avatarY - circleRadius, circleRadius * 2, circleRadius * 2);
        ctx.restore();

        ctx.strokeStyle = dynamicColor;
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(x, avatarY, circleRadius + 6, 0, Math.PI * 2);
        ctx.stroke();
    });

    // Donation amount
    ctx.font = 'bold 120px NotoSans';
    ctx.textAlign = 'center';
    ctx.fillStyle = dynamicColor;

    const robuxEmojiSize = 100;
    if (robuxEmojiUrl) {
        try {
            const emojiImage = await loadImage(robuxEmojiUrl);
            ctx.drawImage(emojiImage, width / 2 - 220, height / 2 - 150, robuxEmojiSize, robuxEmojiSize);
        } catch (err) {
            console.warn("Failed to load Robux emoji:", err.message);
        }
    }

    ctx.fillText(`${amount.toLocaleString()}`, width / 2 + 50, height / 2 - 80);

    // "Donated to"
    ctx.font = 'bold 70px NotoSans';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("donated to", width / 2, height / 2 + 20);

    // Usernames under avatars
    ctx.font = 'bold 55px NotoSans';
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = 'center';
    ctx.fillText(`@${donator.username}`, donatorX, avatarY + circleRadius + 80);
    ctx.fillText(`@${receiver.username}`, receiverX, avatarY + circleRadius + 80);

    return canvas.toBuffer('image/png');
}

module.exports = { generateDonationCard };

app.post('/donation', async (req, res) => {
    try {
        const { donator, receiver, amount, color, emoji } = req.body;

        if (!donator?.id || !receiver?.id || typeof amount !== 'number')
            return res.status(400).json({ error: 'Invalid payload' });

        const robuxEmojiUrl = "https://cdn.discordapp.com/emojis/1206541048063459348.png";

        const buffer = await generateDonationCard({ donator, receiver, amount, color, robuxEmojiUrl });
        const attachment = new AttachmentBuilder(buffer, { name: 'donation.png' });

        const channel = await client.channels.fetch('1273828770884620438');

        const robuxEmojiMessage = "<:robux:1206541048063459348>";
        const content = `${emoji || ""} \`@${donator.username}\` just donated ${robuxEmojiMessage}**${amount.toLocaleString()} Robux** to \`@${receiver.username}\``;

        const embed = new EmbedBuilder()
            .setImage('attachment://donation.png')
            .setColor(color ? parseInt(color.replace('#', ''), 16) : 0x00bdff)
            .setFooter({ text: 'Donated on' })
            .setTimestamp();

        await channel.send({ content, embeds: [embed], files: [attachment] });

        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed' });
    }
});

app.post("/log", async (req, res) => {
  try {
    const { channelId, embeds } = req.body;
    const channel = await client.channels.fetch(channelId);

    if (!channel) return res.status(404).json({ error: "Channel not found" });

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
