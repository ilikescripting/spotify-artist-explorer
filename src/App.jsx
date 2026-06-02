import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import ArtistCard from './components/ArtistCard.jsx';
import TopTracks from './components/TopTracks.jsx';
import AlbumGrid from './components/AlbumGrid.jsx';
import Favourites from './components/Favourites.jsx';
import { demoArtists, demoTracks, demoAlbums } from './demoData.js';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [status, setStatus] = useState('Search for an artist to begin.');
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const savedFavourites = JSON.parse(
      localStorage.getItem('spotifyArtistFavourites')
    ) || [];

    setFavourites(savedFavourites);
  }, []);

  function saveFavourites(updatedFavourites) {
    setFavourites(updatedFavourites);
    localStorage.setItem(
      'spotifyArtistFavourites',
      JSON.stringify(updatedFavourites)
    );
  }

  function loadDemoSearchResults() {
    setDemoMode(true);
    setArtists(demoArtists);
    setSelectedArtist(null);
    setTopTracks([]);
    setAlbums([]);
    setStatus(
      'Spotify API access is currently restricted. Demo mode is active using sample artist data.'
    );
  }

  function loadDemoArtistDetails(artist) {
    setDemoMode(true);
    setSelectedArtist(artist);
    setTopTracks(demoTracks);
    setAlbums(demoAlbums);
    setStatus(
      `Demo mode: showing sample tracks and albums for ${artist.name}.`
    );
  }

  async function searchArtists(query) {
    try {
      setLoading(true);
      setDemoMode(false);
      setStatus('Searching Spotify artists...');
      setSelectedArtist(null);
      setTopTracks([]);
      setAlbums([]);

      const response = await fetch(
        `${API_BASE_URL}/api/search-artist?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Search request failed.');
      }

      const data = await response.json();

      setArtists(data);

      if (data.length === 0) {
        setStatus('No artists found. Try a different search.');
      } else {
        setStatus(`Found ${data.length} artist result(s).`);
      }
    } catch (error) {
      console.error(error);
      loadDemoSearchResults();
    } finally {
      setLoading(false);
    }
  }

  async function selectArtist(artist) {
    if (demoMode || artist.id.startsWith('demo-')) {
      loadDemoArtistDetails(artist);
      return;
    }

    try {
      setSelectedArtist(artist);
      setStatus(`Loading details for ${artist.name}...`);
      setLoading(true);

      const [tracksResponse, albumsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/artist/${artist.id}/top-tracks`),
        fetch(`${API_BASE_URL}/api/artist/${artist.id}/albums`)
      ]);

      if (!tracksResponse.ok || !albumsResponse.ok) {
        throw new Error('Artist detail request failed.');
      }

      const tracksData = await tracksResponse.json();
      const albumsData = await albumsResponse.json();

      setTopTracks(tracksData.slice(0, 10));
      setAlbums(removeDuplicateAlbums(albumsData));

      setStatus(`Showing Spotify data for ${artist.name}.`);
    } catch (error) {
      console.error(error);
      loadDemoArtistDetails(artist);
    } finally {
      setLoading(false);
    }
  }

  function removeDuplicateAlbums(albumList) {
    const seen = new Set();

    return albumList.filter((album) => {
      const key = album.name.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  function addFavourite(artist) {
    const alreadySaved = favourites.some((item) => item.id === artist.id);

    if (alreadySaved) {
      setStatus(`${artist.name} is already in your favourites.`);
      return;
    }

    const updatedFavourites = [
      {
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url || '',
        spotifyUrl: artist.external_urls?.spotify || ''
      },
      ...favourites
    ];

    saveFavourites(updatedFavourites);
    setStatus(`${artist.name} added to favourites.`);
  }

  function removeFavourite(artistId) {
    const updatedFavourites = favourites.filter((artist) => artist.id !== artistId);
    saveFavourites(updatedFavourites);
    setStatus('Artist removed from favourites.');
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Spotify Web API Portfolio Project</p>
        <h1>Spotify Artist Explorer</h1>
        <p>
          Search for artists, view their Spotify profile, explore top tracks and albums,
          and save favourite artists locally in the browser.
        </p>
      </section>

      <SearchBar
        onSearch={searchArtists}
        loading={loading}
        onDemoMode={loadDemoSearchResults}
      />

      {demoMode && (
        <div className="demo-banner">
          Demo mode is active. This fallback is used when Spotify API access is restricted.
        </div>
      )}

      <p className="status">{status}</p>

      {artists.length > 0 && (
        <section className="results-section">
          <h2>Search Results</h2>

          <div className="artist-grid">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onSelect={selectArtist}
                onFavourite={addFavourite}
                isSelected={selectedArtist?.id === artist.id}
              />
            ))}
          </div>
        </section>
      )}

      {selectedArtist && (
        <section className="dashboard">
          <section className="selected-artist">
            <img
              src={selectedArtist.images?.[0]?.url || 'https://placehold.co/300x300?text=Artist'}
              alt={selectedArtist.name}
            />

            <div>
              <p className="eyebrow">Selected Artist</p>
              <h2>{selectedArtist.name}</h2>
              <p>
                <strong>Followers:</strong>{' '}
                {selectedArtist.followers?.total?.toLocaleString() || 'N/A'}
              </p>
              <p>
                <strong>Popularity:</strong> {selectedArtist.popularity}/100
              </p>
              <p>
                <strong>Genres:</strong>{' '}
                {selectedArtist.genres?.length > 0
                  ? selectedArtist.genres.join(', ')
                  : 'No genres listed'}
              </p>

              <a
                className="spotify-link"
                href={selectedArtist.external_urls?.spotify}
                target="_blank"
                rel="noreferrer"
              >
                Open on Spotify
              </a>
            </div>
          </section>

          <TopTracks tracks={topTracks} />

          <AlbumGrid albums={albums} />
        </section>
      )}

      <Favourites
        favourites={favourites}
        onRemove={removeFavourite}
      />
    </main>
  );
}

export default App;