function getTrackImage(track) {
  return (
    track.album?.images?.[0]?.url ||
    track.album?.images?.[1]?.url ||
    'https://placehold.co/80x80/121212/1ed760?text=Track'
  );
}

function handleImageError(event, track) {
  const fallbackImage =
    track.album?.images?.[1]?.url ||
    'https://placehold.co/80x80/121212/1ed760?text=Track';

  if (event.currentTarget.src !== fallbackImage) {
    event.currentTarget.src = fallbackImage;
  }
}

function TopTracks({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return (
      <section className="panel">
        <h2>Top Tracks</h2>
        <p className="muted">No top tracks available.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Top Tracks</h2>

      <div className="track-list">
        {tracks.map((track, index) => (
          <article className="track-item" key={track.id}>
            <span className="track-number">{index + 1}</span>

            <img
              src={getTrackImage(track)}
              alt={`${track.name} artwork`}
              onError={(event) => handleImageError(event, track)}
            />

            <div>
              <h3>{track.name}</h3>
              <p>{track.album?.name}</p>
            </div>

            <a
              href={track.external_urls?.spotify}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TopTracks;