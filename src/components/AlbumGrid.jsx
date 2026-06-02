function getAlbumImage(album) {
  return (
    album.images?.[0]?.url ||
    album.images?.[1]?.url ||
    'https://placehold.co/300x300/121212/1ed760?text=Album'
  );
}

function handleImageError(event, album) {
  const fallbackImage =
    album.images?.[1]?.url ||
    'https://placehold.co/300x300/121212/1ed760?text=Album';

  if (event.currentTarget.src !== fallbackImage) {
    event.currentTarget.src = fallbackImage;
  }
}

function AlbumGrid({ albums }) {
  if (!albums || albums.length === 0) {
    return (
      <section className="panel">
        <h2>Albums and Singles</h2>
        <p className="muted">No albums or singles available.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Albums and Singles</h2>

      <div className="album-grid">
        {albums.map((album) => (
          <article className="album-card" key={album.id}>
            <img
              src={getAlbumImage(album)}
              alt={`${album.name} artwork`}
              onError={(event) => handleImageError(event, album)}
            />

            <div>
              <h3>{album.name}</h3>
              <p>{album.album_type}</p>
              <p>{album.release_date}</p>
              <p>{album.total_tracks} track(s)</p>

              <a
                href={album.external_urls?.spotify}
                target="_blank"
                rel="noreferrer"
              >
                Open on Spotify
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AlbumGrid;