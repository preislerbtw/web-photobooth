import { useRef, useState, useCallback, useEffect } from 'react';
import { useCamera } from '../hooks/useCamera';
import NavBar from "./NavBar";
import { FILTERS, COLORS, TEMPLATES } from '../app/effects';
import { buildStrip } from '../app/buildStrip';
import '../style/Photobooth.css';

const TIMER_OPTIONS = [3, 5, 10];

export default function Photobooth({ maxPhotos = 4, layoutName, templateKey = 'classic', onBack }) {
  const { videoRef, error, isReady, devices, startCamera, stopCamera } = useCamera();
  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(3);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorKey, setColorKey] = useState(TEMPLATES[templateKey].defaultColor);
  const [filter, setFilter] = useState('normal');
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 99999));
  const [strip, setStrip] = useState(null);

  useEffect(() => {
    startCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeviceChange = useCallback((e) => {
    const id = e.target.value;
    setSelectedDeviceId(id);
    startCamera(id);
  }, [startCamera]);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  }, [videoRef]);

  const handleCapture = useCallback(() => {
    if (isCapturing || photos.length >= maxPhotos) return;
    setIsCapturing(true);

    let count = timerSeconds;
    setCountdown(count);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown('📸');
        const dataUrl = captureFrame();
        if (dataUrl) {
          setPhotos((prev) => [dataUrl, ...prev]);
        }
        setTimeout(() => {
          setCountdown(null);
          setIsCapturing(false);
        }, 500);
      }
    }, 1000);
  }, [isCapturing, photos.length, maxPhotos, timerSeconds, captureFrame]);

  // permite subir uma imagem do computador em vez de usar a câmera
  const handleUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file || photos.length >= maxPhotos) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => [reader.result, ...prev]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [photos.length, maxPhotos]);

  const handleDownload = useCallback((dataUrl, index) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `photobooth-${Date.now()}-${index}.png`;
    link.click();
  }, []);

  // gera a tira (preview e download usam a mesma imagem)
  useEffect(() => {
    if (photos.length === 0) {
      setStrip(null);
      return;
    }
    let cancelled = false;
    // photos guarda a mais recente primeiro; na tira a 1ª foto fica no topo
    buildStrip([...photos].reverse(), {
      templateKey,
      colorKey,
      filterCss: FILTERS[filter].css,
      seed,
    }).then((url) => {
      if (!cancelled) setStrip(url);
    });
    return () => { cancelled = true; };
  }, [photos, templateKey, colorKey, filter, seed]);

  const handleDownloadStrip = useCallback(() => {
    if (!strip) return;
    const link = document.createElement('a');
    link.href = strip;
    link.download = `photobooth-strip-${Date.now()}.png`;
    link.click();
  }, [strip]);

  const handleClearAll = useCallback(() => {
    setPhotos([]);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="photobooth">
      <NavBar active="layouts" />

      <div className="photobooth-stage">
        {onBack && (
          <button className="btn-back" onClick={onBack}>← Change Layout</button>
        )}

        <div className="photo-counter">
          {layoutName && <span className="layout-badge">{layoutName}</span>}
          {photos.length}/{maxPhotos}
        </div>

        <div className="stage-controls">
          <select
            className="control-select"
            value={selectedDeviceId}
            onChange={handleDeviceChange}
            disabled={devices.length === 0}
          >
            {devices.length === 0 && <option>Loading cameras...</option>}
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || 'Câmera'}
              </option>
            ))}
          </select>

          <label className="control-upload">
            ⬆ Upload Image
            <input type="file" accept="image/*" onChange={handleUpload} hidden />
          </label>

          <select
            className="control-select control-timer"
            value={timerSeconds}
            onChange={(e) => setTimerSeconds(Number(e.target.value))}
          >
            {TIMER_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}s</option>
            ))}
          </select>
        </div>

        <div className="video-wrapper" ref={stageRef}>
          {!isReady && !error && (
            <div className="stage-message">Waiting acess at you camera...</div>
          )}

          {error && (
            <div className="stage-message stage-error">
              <p>{error}</p>
              <button className="btn-retry" onClick={() => startCamera(selectedDeviceId)}>
                Try Again
              </button>
            </div>
          )}

          <video ref={videoRef} muted playsInline className="video-mirror" />
          {countdown && <div className="countdown-overlay">{countdown}</div>}

          <button className="btn-fullscreen" onClick={toggleFullscreen}>
            {isFullscreen ? '⤡' : '⤢'}
          </button>
        </div>

        <div className="controls">
          <button
            className="btn btn-capture"
            onClick={handleCapture}
            disabled={isCapturing || !isReady || photos.length >= maxPhotos}
          >
            {isCapturing ? 'Aguarde...' : 'Take Photo'}
          </button>
          <button className="btn btn-secondary" onClick={stopCamera}>
            Turn Off Camera
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {photos.length > 0 && (
        <div className="strip-section">
          <h2>Your Strip</h2>

          <div className="option-group">
            <span className="option-label">Color</span>
            <div className="option-row">
              {Object.entries(COLORS).map(([key, c]) => (
                <button
                  key={key}
                  className={`chip ${colorKey === key ? 'chip-active' : ''}`}
                  onClick={() => setColorKey(key)}
                >
                  <span className="chip-dot" style={{ background: c.bg, borderColor: c.border }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <span className="option-label">Filter</span>
            <div className="option-row">
              {Object.entries(FILTERS).map(([key, f]) => (
                <button
                  key={key}
                  className={`chip ${filter === key ? 'chip-active' : ''}`}
                  onClick={() => setFilter(key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="strip-preview">
            {strip && (
              <img
                src={strip}
                alt="Tira de fotos"
                style={{ transform: `rotate(${TEMPLATES[templateKey].tilt}deg)` }}
              />
            )}
          </div>

          <div className="controls">
            {TEMPLATES[templateKey].stickers && (
              <button className="btn btn-secondary" onClick={() => setSeed(Math.floor(Math.random() * 99999))}>
                Shuffle stickers
              </button>
            )}
            <button className="btn btn-capture" onClick={handleDownloadStrip} disabled={!strip}>
              Download Strip
            </button>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="gallery">
          <div className="gallery-header">
            <h2>Your Photos ({photos.length})</h2>
            <button className="btn btn-clear" onClick={handleClearAll}>Clean All</button>
          </div>
          <div className="gallery-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-card">
                <img src={photo} alt={`Captura ${index + 1}`} />
                <button className="btn btn-download" onClick={() => handleDownload(photo, index)}>
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}