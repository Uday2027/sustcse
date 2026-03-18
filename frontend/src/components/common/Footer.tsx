import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3 className="footer__title">CSE - SUST</h3>
          <p className="footer__text">
            Department of Computer Science & Engineering<br />
            Shahjalal University of Science and Technology<br />
            Sylhet-3114, Bangladesh
          </p>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">Quick Links</h3>
          <nav className="footer__links">
            <Link to="/notices">Notices</Link>
            <Link to="/events">Events</Link>
            <Link to="/faculty">Faculty</Link>
            <Link to="/alumni">Alumni</Link>
            <Link to="/society">CSE Society</Link>
          </nav>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">Contact</h3>
          <div className="footer__contact">
            <p><FiMapPin /> Sylhet-3114, Bangladesh</p>
            <p><FiPhone /> +880-821-713491</p>
            <p><FiMail /> cse@sust.edu</p>
          </div>
        </div>
        <div className="footer__section">
          <h3 className="footer__title">Join Us</h3>
          <p className="footer__text" style={{ marginBottom: '1rem' }}>
            Become a part of the CSE SUST community.
          </p>
          <Link to="/auth" className="skeu-btn skeu-btn--primary skeu-btn--sm" style={{ display: 'inline-flex' }}>
            Register Now
          </Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Department of CSE, SUST. All rights reserved.</p>
      </div>
    </footer>
  );
}
