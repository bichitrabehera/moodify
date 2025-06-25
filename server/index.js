const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let cachedAccessToken = null;
let tokenExpirationTime = 0;

// 🔁 Refresh token and cache it
async function getAccessToken() {
  const currentTime = Date.now();

  // Use cached token if valid
  if (cachedAccessToken && currentTime < tokenExpirationTime) {
    return cachedAccessToken;
  }

  // Otherwise refresh it
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("❌ Failed to refresh token: " + JSON.stringify(data));
  }

  // Cache access token and set expiry
  cachedAccessToken = data.access_token;
  tokenExpirationTime = Date.now() + data.expires_in * 1000; // typically 3600 seconds

  console.log("🔁 Token refreshed, valid until:", new Date(tokenExpirationTime).toLocaleTimeString());
  return cachedAccessToken;
}

// 🎵 Call Spotify API with auto-refreshing token
async function fetchWebApi(endpoint, method, body = null) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Spotify API error: ${res.status} - ${errorDetails}`);
  }

  return await res.json();
}

// 🔍 Mood search
app.get("/api/:mood", async (req, res) => {
  const { mood } = req.params;
  try {
    const data = await fetchWebApi(
      `v1/search?q=${encodeURIComponent(mood)}&type=track&limit=5`,
      "GET"
    );

    const tracks = data.tracks?.items.map((track) => ({
      name: track.name,
      artists: track.artists.map((a) => a.name).join(", "),
      url: track.external_urls.spotify,
      image: track.album.images[0]?.url,
    }));

    res.json({ mood, tracks });
  } catch (err) {
    console.error("❌ Error fetching tracks:", err.message);
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
