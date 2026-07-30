import { useState } from 'react';
import Navbar from './Navbar';
import '../style/Landing.css';

export const LAYOUTS = [
  { id: 'a', name: 'Layout A', poses: 3 },
  { id: 'b', name: 'Layout B', poses: 4 },
  { id: 'c', name: 'Layout C', poses: 5 },
  { id: 'd', name: 'Layout D', poses: 6 },
  { id: 'e', name: 'Layout E', poses: 7 },
];

export default function Landing({ onStart }) {
  const [selectedLayout, setSelectedLayout] = useState('a');

  return (
    <div className="landing">
      <Navbar active="home" />

      <section className="hero">
        <div className="strip strip-left">
          <div className="strip-frame" />
          <div className="strip-frame" />
          <div className="strip-frame" />
          <div className="strip-frame" />
        </div>

        <div className="hero-content">
          <span className="hero-tag">✦ your moment, your booth</span>
          <h1>
            capture the <span className="accent">moment.</span>
          </h1>
          <p>Take photos directly from your browser, choose a layout, and download your comic strip.</p>
          <button className="btn-start" onClick={() => onStart(selectedLayout)}>
            Start ✦
          </button>
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
      </section>
    </div>
  );
}