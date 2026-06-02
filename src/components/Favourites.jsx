function Favourites({ favourites, onRemove }) {
  return (
    <section className="panel favourites-panel">
      <h2>Saved Favourite Artists</h2>

      {favourites.length === 0 ? (
        <p className="muted">No favourite artists saved yet.</p>
      ) : (
        <div className="favourites-grid">
          {favourites.map((artist) => (
            <article className="favourite-card" key={artist.id}>
              <img
                src={artist.image || 'https://placehold.co/120x120?text=Artist'}
                alt={artist.name}
              />

              <div>
                <h3>{artist.name}</h3>

                <a
                  href={artist.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open on Spotify
                </a>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onRemove(artist.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Favourites;