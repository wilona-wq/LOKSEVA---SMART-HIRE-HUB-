# LOKSEVA — SMART HIRE HUB

This repository contains a simple Node.js/Express backend and static HTML frontend for a local services booking app.

## Quick start

1. **Install dependencies**
   ```bash
   cd Backend
   npm install
   ```
2. **Configure environment**
   - copy `.env` or edit the existing one with your `MONGO_URI`, `SESSION_SECRET`, `EMAIL_USER` and `EMAIL_PASS`.
3. **Start MongoDB** (e.g. `mongod` or use Atlas).
4. **Run the server**
   ```bash
   npm run dev   # or npm start
   ```
5. **Open the app in browser**
   Browse to [http://localhost:3000/login.html](http://localhost:3000/login.html). User and provider pages are served from `Backend/Public`; there is a duplicate `Frontend/` folder used for development but only the `Backend/Public` contents are actually served by the Express server. Editing files in `Frontend/` will not affect the running app unless you copy them into `Backend/Public` or adjust the server configuration (both are now served).

## Folders

- `Backend/` – server code, routes, models, and public assets served by Express.
- `Frontend/` – a second copy of the static site (for offline prototyping). The server now also serves these files so you can edit either folder.

## Common issues

- **Can’t login even though password is correct?**  Make sure you verified the OTP sent to your Gmail address. Also open the page through the server (not via `file://`).
- **Server crashes on database error** – the app now exits if MongoDB connection fails; ensure `MONGO_URI` is valid.
