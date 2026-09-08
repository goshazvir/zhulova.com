import { useState, useEffect } from 'react';

export default function ReikiMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    const btn = document.getElementById('hamburger-btn');
    if (btn) btn.addEventListener('click', handler);
    return () => { if (btn) btn.removeEventListener('click', handler); };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const handleLinkClick = () => {
    close();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-nav open" id="mob-nav">
      <button className="mobile-close" onClick={close}>×</button>
      <a href="#about" onClick={handleLinkClick}>About</a>
      <a href="#outcomes" onClick={handleLinkClick}>Results</a>
      <a href="#reiki" onClick={handleLinkClick}>What is Reiki</a>
      <a href="#packages" onClick={handleLinkClick}>Packages</a>
      <a href="#faq" onClick={handleLinkClick}>FAQ</a>
      <a href="#journal" onClick={handleLinkClick}>Journal</a>
      <a href="#book" onClick={handleLinkClick} style={{ color: 'var(--gold)' }}>Book a session</a>
    </div>
  );
}
