interface Props {
  shortId: string;
}

export default function YouTubeBackground({ shortId }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <iframe
        src={`https://www.youtube.com/embed/${shortId}?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&playlist=${shortId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '100vw',
          height: '100vh',
          minWidth: '100%',
          minHeight: '100%',
          objectFit: 'cover',
        }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Exercise demo"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
    </div>
  );
}
