# Discord Bot Anti-Link dengan Whitelist Role (Render Hosting)

### 🚀 Deploy ke Render
1. Upload project ini ke GitHub.
2. Buat Web Service di [Render](https://render.com).
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Tambahkan Environment Variable:
   - `MTQxNTAxNzMyMjQ1MTY5Nzc5NQ.GSSZTB.7PSnl4b7EbwQHmRJUMDneBOqivfACHaFBOLwvs` = token bot dari Discord Developer Portal
6. Pastikan bot punya permission **Manage Messages** di server Discord.
7. Edit `index.js` → ubah daftar role whitelist di:
   ```js
   const ALLOWED_ROLES = ["1317800016663941223", "1318101701441491025r"];
