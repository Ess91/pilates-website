import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Muted, looping background film. Respects reduced-motion by showing the poster only.
const BackgroundVideo = forwardRef(function BackgroundVideo({ src, poster }, ref) {
  const video = useRef(null);
  useImperativeHandle(ref, () => video.current);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    if (prefersReducedMotion()) v.pause();
    else v.play().catch(() => {});
  }, [src]);

  return (
    <video ref={video} autoPlay={!prefersReducedMotion()} muted loop playsInline preload="metadata" poster={poster}>
      <source src={src} type="video/mp4" />
    </video>
  );
});

export default BackgroundVideo;
