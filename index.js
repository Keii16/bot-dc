require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const express = require('express'); // Untuk UptimeRobot

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// ---------------------------
// Konfigurasi
// ---------------------------
const logChannelId = process.env.LOG_CHANNEL_ID;
const whitelistChannels = process.env.WHITELIST_CHANNELS ? process.env.WHITELIST_CHANNELS.split(',') : [];
const muteRoleId = process.env.MUTE_ROLE_ID;
const muteDuration = process.env.MUTE_DURATION ? parseInt(process.env.MUTE_DURATION) : 600000;

// ---------------------------
// Event: Bot siap
// ---------------------------
client.once('ready', () => {
    console.log(`${client.user.tag} online!`);
});

// ---------------------------
// Event: Anti-Link
// ---------------------------
client.on('messageCreate', async message => {
    if (message.author.bot) return; // Skip bot
    if (whitelistChannels.includes(message.channel.id)) return; // Skip channel whitelist

    const linkRegex = /(https?:\/\/[^\s]+)/g;
    if (linkRegex.test(message.content)) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            try {
                // Hapus pesan
                await message.delete();

                // Kirim peringatan sementara
                await message.channel.send(`${message.author}, link tidak diperbolehkan!`).then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });

                // ---------------------------
                // Log ke channel
                // ---------------------------
                const logChannel = await client.channels.fetch(logChannelId);
                if (logChannel) {
                    logChannel.send(`Link dihapus dari ${message.author.tag} (${message.author.id}) di ${message.channel}: \n${message.content}`);
                }

                // ---------------------------
                // Tambah role mute sementara
                // ---------------------------
                if (muteRoleId && message.member.manageable) {
                    const muteRole = message.guild.roles.cache.get(muteRoleId);
                    if (muteRole) {
                        await message.member.roles.add(muteRole);
                        setTimeout(() => {
                            message.member.roles.remove(muteRole).catch(console.log);
                        }, muteDuration);
                    }
                }

            } catch (err) {
                console.log('Error: ', err);
            }
        }
    }
});

// ---------------------------
// Web Server untuk UptimeRobot
// ---------------------------
const app = express();
app.get('/', (req, res) => {
    res.send('Bot is online!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});

// ---------------------------
// Login bot
// ---------------------------
client.login(process.env.DISCORD_TOKEN);
