import { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import { TEMPLATES } from '../app/effects';
import { buildStrip, placeholderPhotos } from '../app/buildStrip';
import '../style/Landing.css';

export const LAYOUTS = [
  { id: 'a', name: 'Layout A', poses: 3 },
  { id: 'b', name: 'Layout B', poses: 4 },
  { id: 'c', name: 'Layout C', poses: 5 },
  { id: 'd', name: 'Layout D', poses: 6 },
  { id: 'e', name: 'Layout E', poses: 7 },
];

const TEMPLATE_KEYS = Object.keys(TEMPLATES);

export default function Landing({ onStart }) {
  const [selectedLayout, setSelectedLayout] = useState('a');
  const [templateKey, setTemplateKey] = useState(TEMPLATE_KEYS[0]);
  const [preview, setPreview] = useState(null);

  const poses = LAYOUTS.find((l) => l.id === selectedLayout).poses;

  // preview do template com o número de poses do layout escolhido
  useEffect(() => {
    let cancelled = false;
    buildStrip(placeholderPhotos(poses), { templateKey, photoSize: 170, seed: 7 }).then((url) => {
      if (!cancelled) setPreview(url);
    });
    return () => { cancelled = true; };
  }, [poses, templateKey]);

  const move = (dir) => {
    const i = TEMPLATE_KEYS.indexOf(templateKey);
    setTemplateKey(TEMPLATE_KEYS[(i + dir + TEMPLATE_KEYS.length) % TEMPLATE_KEYS.length]);
  };

  const start = () => onStart(selectedLayout, { templateKey });

  return (
    <div className="landing">
      <NavBar active="home" />

      <section className="hero">
        <div className="strip strip-left">
          <div className="strip-frame" />
          <div className="strip-frame" />
          <div className="strip-frame" />
          <div className="strip-frame" />
        </div>

        <div className="hero-content">
          <span className="hero-tag">✦ Your moment, Your booth</span>
          <h1>
            Capture the <span className="accent">moment</span>
          </h1>
          <p>Take photos directly from your browser, choose a layout, and download your comic strip.</p>
          {/* <button className="btn-start" onClick={start}>
            Start ✦
          </button> */}
        </div>

        <div className="strip strip-right">
          <div className="strip-frame" />
          <div className="strip-frame" />
          <div className="strip-frame" />
          <div className="strip-frame" />
        </div>
      </section>

      <section className="layouts" id="layouts">
        <h2>Choose your Layout</h2>
        <p className="layouts-subtitle">Select one of the comic strip formats.</p>

        <div className="layouts-grid">
          {LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              className={`layout-card ${selectedLayout === layout.id ? 'is-selected' : ''}`}
              onClick={() => setSelectedLayout(layout.id)}
            >
              <div className="layout-preview">
                {Array.from({ length: layout.poses }).map((_, i) => (
                  <div key={i} className="layout-slot" />
                ))}
              </div>
              <span className="layout-name">{layout.name}</span>
              <span className="layout-meta">{layout.poses} poses</span>
            </button>
          ))}
        </div>

        <h2 className="templates-title">Choose your Template</h2>
        <p className="layouts-subtitle">Colors and filters you pick after taking the photos.</p>

        <div className="template-carousel">
          <button className="carousel-arrow" onClick={() => move(-1)} aria-label="Previous template">‹</button>

          <div className="template-stage">
            {preview && (
              <img
                src={preview}
                alt={TEMPLATES[templateKey].label}
                style={{ transform: `rotate(${TEMPLATES[templateKey].tilt}deg)` }}
              />
            )}
          </div>

          <button className="carousel-arrow" onClick={() => move(1)} aria-label="Next template">›</button>
        </div>

        <span className="template-name">{TEMPLATES[templateKey].label}</span>
        <div className="carousel-dots">
          {TEMPLATE_KEYS.map((key) => (
            <button
              key={key}
              className={`carousel-dot ${key === templateKey ? 'is-active' : ''}`}
              onClick={() => setTemplateKey(key)}
              aria-label={TEMPLATES[key].label}
            />
          ))}
        </div>

        <button className="btn-start layouts-start" onClick={start}>
          Start ✦
        </button>
      </section>
    </div>
  );
}