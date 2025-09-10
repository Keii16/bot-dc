const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const express = require("express");

// Express web server biar Render deteksi bot "hidup"
const app = express();
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(3000, () => console.log("🌐 Web server running on port 3000"));

// Buat client bot Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Role yang boleh kirim link
const ALLOWED_ROLES = ["1317800016663941223", "1318101701441491025"]; // ubah sesuai nama role di server kamu

// Fitur Anti-Link + Whitelist
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return; // abaikan pesan dari bot

  const linkRegex = /(https?:\/\/|www\.)\S+/gi;

  if (linkRegex.test(msg.content)) {
    // cek kalau user punya role whitelist
    const memberRoles = msg.member.roles.cache.map(r => r.name);
    const hasAllowedRole = memberRoles.some(role => ALLOWED_ROLES.includes(role));

    if (hasAllowedRole) return; // biarkan kalau punya role whitelist

    // cek kalau bot punya izin hapus pesan
    if (msg.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      await msg.delete().catch(() => {});
      msg.channel.send(`${msg.author}, dilarang mengirim link di sini! 🚫`);
    } else {
      console.log("⚠️ Bot tidak punya izin Manage Messages.");
    }
  }
});

client.login(process.env.TOKEN); // Token dari Render Environment Variable
