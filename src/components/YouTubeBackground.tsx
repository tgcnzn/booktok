interface Props {
  videoId: string;
}

export default function YouTubeBackground({ videoId }: Props) {
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&origin=${window.location.origin}`;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <iframe
        src={src}
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          width: '200vw',
          height: '200vh',
          transform: 'translate(-50%, -50%)',
          border: 'none',
        }}
        allow="autoplay; encrypted-media; accelerometer; gyroscope"
        allowFullScreen
        title="Exercise demo"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
    </div>
  );
}
