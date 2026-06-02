import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let cachedToken = null;
let tokenExpiryTime = 0;

app.use(cors());
app.use(express.json());

async function getSpotifyAccessToken() {
  const currentTime = Date.now();

  if (cachedToken && currentTime < tokenExpiryTime) {
    return cachedToken;
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify Client ID or Client Secret is missing.');
  }

  const credentials = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'client_credentials'
    }),
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiryTime = currentTime + response.data.expires_in * 1000 - 60000;

  return cachedToken;
}

async function spotifyGet(url, params = {}) {
  const token = await getSpotifyAccessToken();

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  });

  return response.data;
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Spotify Artist Explorer backend is running.'
  });
});

app.get('/api/search-artist', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Search query is required.'
      });
    }

    const data = await spotifyGet('https://api.spotify.com/v1/search', {
      q: query,
      type: 'artist',
      limit: 5
    });

    res.json(data.artists.items);
  } catch (error) {
    console.error('Search artist error:', error.response?.data || error.message);

    res.status(500).json({
      error: 'Failed to search for artist.'
    });
  }
});

app.get('/api/artist/:id/albums', async (req, res) => {
  try {
    const artistId = req.params.id;

    const data = await spotifyGet(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        include_groups: 'album,single',
        market: 'GB',
        limit: 20
      }
    );

    res.json(data.items);
  } catch (error) {
    console.error('Artist albums error:', error.response?.data || error.message);

    res.status(500).json({
      error: 'Failed to fetch artist albums.'
    });
  }
});

app.get('/api/artist/:id/top-tracks', async (req, res) => {
  try {
    const artistId = req.params.id;

    const data = await spotifyGet(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        market: 'GB'
      }
    );

    res.json(data.tracks);
  } catch (error) {
    console.error('Top tracks error:', error.response?.data || error.message);

    res.status(500).json({
      error: 'Failed to fetch artist top tracks.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});