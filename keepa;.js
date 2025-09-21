const express = require('express');
const bodyParser = require('body-parser');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fetch = require('node-fetch');
const { Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const client = new Client({ intents: 3276799 });
client.login(process.env.TOKEN);

const app = express();
app.use(bodyParser.json());
const fetch = require('node-fetch');

registerFont('./fonts/NotoSans-Regular.ttf', { family: 'NotoSans' });
registerFont('./fonts/NotoColorEmoji.ttf', { family: 'NotoEmoji' }); // optional if using emojis

async function generateDonationCard({ donator, receiver, amount, color, robuxEmojiUrl }) {
    const width = 1200;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const dynamicColor = color || getColorFromAmount(amount);

    ctx.clearRect(0, 0, width, height); // transparent background

    // Load avatars
    const donatorAvatar = await loadRobloxAvatar(donator.id);
    const receiverAvatar = await loadRobloxAvatar(receiver.id);

    // Draw avatars with circular clipping & borders (same as before)
    const circleRadius = 100;
    const avatarY = height / 2;
    const donatorX = width * 0.15;
    const receiverX = width * 0.85;

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

    // Draw Robux amount on card with custom emoji
    ctx.font = 'bold 80px NotoSans'; // use registered font
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = dynamicColor;

    let emojiWidth = 0;
    if (robuxEmojiUrl) {
        try {
            const emojiImage = await loadImage(robuxEmojiUrl);
            emojiWidth = 60; // adjust size
            ctx.drawImage(emojiImage, width / 2 - 150, height * 0.35 - 30, emojiWidth, emojiWidth);
        } catch (err) {
            console.warn("Failed to load Robux emoji:", err.message);
        }
    }

    ctx.fillText(`R$ ${amount.toLocaleString()}`, width / 2 + emojiWidth / 2, height * 0.4);

    // "donated to" text
    ctx.font = '50px NotoSans';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('donated to', width / 2, height * 0.55);

    // Donator & receiver names
    ctx.font = '35px NotoSans';
    ctx.fillText(`@${donator.username}`, donatorX, avatarY + circleRadius + 50);
    ctx.fillText(`@${receiver.username}`, receiverX, avatarY + circleRadius + 50);

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
        const { donator, receiver, amount, color, emoji } = req.body; // emoji from Roblox

        // Validate payload
        if (!donator || !donator.id) return res.status(400).json({ error: "Missing donator.id" });
        if (!receiver || !receiver.id) return res.status(400).json({ error: "Missing receiver.id" });
        if (typeof amount !== "number") return res.status(400).json({ error: "Invalid amount" });

        // Robux custom emoji URL
        const robuxEmojiUrl = "https://cdn.discordapp.com/emojis/1206541048063459348.webp?size=96";

        const buffer = await generateDonationCard({ donator, receiver, amount, color, robuxEmojiUrl });
        const attachment = new AttachmentBuilder(buffer, { name: 'donation.png' });

        const channel = await client.channels.fetch('1273828770884620438');

        // Robux custom emoji for message content (Discord emoji format)
        const robuxEmojiMessage = "<:robux:1206541048063459348>";

        // Send message: Roblox emoji at start + bold Robux amount + backticks for usernames
        await channel.send({
            content: `${emoji || ""} \`${donator.username}\` just donated ${robuxEmojiMessage}**${amount.toLocaleString()}** to \`${receiver.username}\`!`,
            files: [attachment]
        });

        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
