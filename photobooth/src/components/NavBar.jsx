import '../style/NavBar.css';

export default function Navbar({ active = 'Home' }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'layouts', label: 'Choose Layout' },
  ];

  return (
    <nav className="navbar">
      <span className="navbar-logo">Photobooth</span>

      <div className="navbar-links">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={active === link.id ? 'is-active' : ''}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="navbar-socials">
        <a href="https://github.com/preislerbtw" className="social-icon" aria-label="GitHub">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12Z"/>
          </svg>
        </a>
        <a href="https://x.com/preislerbtw" className="social-icon" aria-label="Twitter/X">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M18.9 1.9h3.7l-8.1 9.3 9.5 12.9h-7.4l-5.8-7.6-6.6 7.6H.6l8.7-10-9.2-12.2h7.6l5.2 7 6-7Zm-1.3 20h2L6.5 4H4.3l13.3 17.9Z"/>
          </svg>
        </a>
      </div>
    </nav>
  );
}