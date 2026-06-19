import { useState, useRef, useEffect, useCallback } from 'react';

export default function ProjectGallery({ images, name }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    setActiveIdx(idx);
    // reset auto-advance timer on manual interaction
    if (timerRef.current) clearInterval(timerRef.current);
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveIdx((prev) => (prev + 1) % images.length);
      }, 5000);
    }
  }, [images.length]);

  const goNext = useCallback(() => goTo((activeIdx + 1) % images.length), [activeIdx, images.length, goTo]);
  const goPrev = useCallback(() => goTo((activeIdx - 1 + images.length) % images.length), [activeIdx, images.length, goTo]);

  useEffect(() => {
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveIdx((prev) => (prev + 1) % images.length);
      }, 5000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length]);

  return (
    <div className="gallery">
      <div className="gallery__viewport">
        {images.map((src, i) => (
          <img
            key={src}
            className={`gallery__img ${i === activeIdx ? 'gallery__img--active' : ''}`}
            src={src}
            alt={`${name} screenshot ${i + 1}`}
            draggable={false}
          />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button className="gallery__arrow gallery__arrow--prev" onClick={goPrev} aria-label="Previous image">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className="gallery__arrow gallery__arrow--next" onClick={goNext} aria-label="Next image">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div className="gallery__dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`gallery__dot ${i === activeIdx ? 'gallery__dot--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
      <div className="gallery__counter">
        {activeIdx + 1} / {images.length}
      </div>
    </div>
  );
}
